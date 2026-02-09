"use client";

import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Home,
  Loader2,
  Mail,
  Phone,
  PhoneCall,
  User,
} from "lucide-react";
import type React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: fetch, isLoading } = useGetUserByIdQuery(id);

  const InfoItem = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value?: string;
    icon: React.ElementType;
  }) =>
    value ? (
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    ) : null;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!fetch?.user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 rounded-full bg-red-100 items-center justify-center">
            <User className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Account Not Found
          </h1>
          <p className="text-muted-foreground max-w-md">
            The user account you're looking for doesn't exist or may have been
            removed.
          </p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = fetch.user;
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <div className="flex justify-between ">
            <Button variant="outline" size="sm" asChild className="mb-4">
              <Link to="/dashboard/accounts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {user?.role === "account" && (
              <div className="flex flex-wrap gap-3">
                {user?._id && (
                  <Button asChild variant="default" size="sm">
                    <Link
                      to={`/${user?.user?.role}/all-tithe-paid-online/${user?._id}`}
                    >
                      Online Tithes
                    </Link>
                  </Button>
                )}
                {user?.tithe_number && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to={`/${user?.role}/all-tithe-paid/${user?.tithe_number}`}
                    >
                      Offline Tithes
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              {user?.avatar?.url ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-md mb-4">
                  <img
                    src={user.avatar.url || "/placeholder.svg"}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarFallback className="text-2xl">
                    {getInitials(user?.firstName || "User")}
                  </AvatarFallback>
                </Avatar>
              )}

              <h2 className="text-xl font-bold">{user?.firstName} {""} {user?.lastName}</h2>
              <Badge className="mt-2">{user.role}</Badge>

              {user.email && (
                <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.phoneNumber && (
                <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                  <PhoneCall className="h-4 w-4" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Full Name" value={user?.name} icon={User} />
                <InfoItem
                  label="Email Address"
                  value={user?.email}
                  icon={Mail}
                />
                <InfoItem
                  label="Phone Number"
                  value={user?.phone_number}
                  icon={Phone}
                />
                <InfoItem label="Gender" value={user?.gender} icon={User} />
                <InfoItem
                  label="Date of Birth"
                  value={
                    user?.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString()
                      : undefined
                  }
                  icon={Calendar}
                />
                <InfoItem label="Country" value={user?.country} icon={Globe} />
                <InfoItem label="Address" value={user?.address} icon={Home} />
              </div>
            </CardContent>
          </Card>

          {/* Membership Details Card */}
          {user?.membership && user.membership.length > 0 && (
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Membership Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user.membership.map((group: any, index: number) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{group.type}</Badge>
                        <span className="text-primary font-medium">
                          {group.tithe_number}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-sm text-muted-foreground">
                        Organization
                      </p>
                      <p className="font-medium">{group.organization}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
