import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Camera, User, CheckCircle2, AlertCircle, RotateCw, Upload, X, Shield, ArrowLeft, ChevronLeft } from "lucide-react";
import Webcam from "react-webcam";
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { DashboardHeader } from "@/components/DashboardHeader";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user"
};

// Simple face detection simulation
class FaceDetectionSimulator {
  private consecutiveDetections = 0;
  private readonly requiredConsecutiveDetections = 2;

  detectFace() {
    // Simulate face detection when user positions face in center
    const isFaceInCenter = Math.random() > 0.3; // 70% chance when positioned well
    
    if (isFaceInCenter) {
      this.consecutiveDetections++;
      if (this.consecutiveDetections >= this.requiredConsecutiveDetections) {
        return {
          detected: true,
          confidence: 0.85
        };
      }
    } else {
      this.consecutiveDetections = 0;
    }

    return {
      detected: false,
      confidence: 0
    };
  }
}

export default function PhotoUploadPage() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);
  const [flash, setFlash] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 720, height: 720 });

  const faceDetector = useRef(new FaceDetectionSimulator());

  useEffect(() => {
    // Start camera on component mount
    const timer = setTimeout(() => {
      setIsCameraActive(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (webcamRef.current?.video?.srcObject) {
        const stream = webcamRef.current.video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update container size on resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (videoContainerRef.current) {
        const { width, height } = videoContainerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  // Simulate face detection
  useEffect(() => {
    if (!isCameraActive || capturedImage) return;

    const detectFace = () => {
      const detection = faceDetector.current.detectFace();
      setFaceDetected(detection.detected);
      setFaceConfidence(detection.confidence);
      
      if (detection.detected) {
        setError(""); // Clear error when face is detected
      }
    };

    // Run detection every second
    const interval = setInterval(detectFace, 1000);
    return () => clearInterval(interval);
  }, [isCameraActive, capturedImage]);

  const capturePhoto = () => {
    if (webcamRef.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      
      const imageSrc = webcamRef.current.getScreenshot({
        width: 400,
        height: 400
      });
      
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setUploadStatus('idle');
        setError(""); // Clear any previous errors
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setUploadStatus('idle');
    setError("");
    setFaceDetected(false);
    setFaceConfidence(0);
  };

  const uploadPhoto = async () => {
    if (!capturedImage) return;

    setUploadStatus('uploading');
    setError("");
    setProgress(0);

    try {
      // Convert base64 to blob and then to base64 string for Cloudinary
      // The captured image is already in base64 format
      const base64Image = capturedImage;
      
      // Remove the data:image/jpeg;base64, prefix if present
      const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1] 
        : base64Image;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the updateUserAvatar API with base64 string
      const result = await updateAvatar({ avatar: base64Image }).unwrap();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setUploadStatus('success');
        setUploadMessage("Profile photo updated successfully!");
        
        // Navigate after success
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      } else {
        setUploadStatus('failed');
        setError(result.message || "Failed to upload photo");
      }
    } catch (err: any) {
      setUploadStatus('failed');
      setError(err?.data?.message || "Failed to upload photo. Please try again.");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setUploadStatus('idle');
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #187339 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, #187339 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-100/10 to-emerald-100/5 rounded-full blur-3xl animate-float-shape-1"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tr from-green-200/5 to-emerald-200/3 rounded-full blur-3xl animate-float-shape-2"></div>

        {/* Grid Lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #187339 1px, transparent 1px),
              linear-gradient(to bottom, #187339 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <DashboardHeader title="Profile Photo Setup" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Responsive Back Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={goBack}
                variant="outline"
                size="sm"
                className="group border-green-200 bg-white/80 hover:bg-green-50 hover:border-green-300 text-green-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Profile</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
            
            <Button
              onClick={() => navigate("/dashboard/profile")}
              variant="ghost"
              size="sm"
              className="md:hidden text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Profile Photo Setup</h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Take a clear photo for your profile. This helps others recognize you.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera/Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="w-6 h-6 text-green-600" />
                  Live Camera
                </h2>
                {!capturedImage && (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      faceDetected && faceConfidence > 0.7 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-gray-300'
                    }`} />
                    <span className="text-sm">
                      {faceDetected && faceConfidence > 0.7 
                        ? `Ready to capture` 
                        : 'Position your face'}
                    </span>
                  </div>
                )}
              </div>

              {!capturedImage ? (
                <div 
                  ref={videoContainerRef}
                  className="relative rounded-xl overflow-hidden bg-black"
                >
                  {isCameraActive ? (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="w-full h-auto"
                        onUserMedia={() => console.log("Camera activated")}
                        onUserMediaError={() => {
                          setError("Could not access camera. Please check permissions.");
                          setIsCameraActive(false);
                        }}
                      />
                      
                      {/* Centered guide overlay */}
                      <div 
                        className="absolute border-2 border-dashed border-green-400 rounded-lg pointer-events-none"
                        style={{
                          left: '25%',
                          top: '25%',
                          width: '50%',
                          height: '50%',
                          boxShadow: '0 0 30px rgba(34, 197, 94, 0.1)'
                        }}
                      >
                        {/* Corner indicators */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl"></div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl"></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br"></div>
                        
                        {/* Center guide lines */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500/30 transform -translate-y-1/2"></div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-500/30 transform -translate-x-1/2"></div>
                        
                        {/* Center dot */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>

                      {/* Camera flash effect */}
                      {flash && (
                        <div className="absolute inset-0 bg-white animate-flash" />
                      )}
                    </>
                  ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-white">
                      <Camera className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg">Camera is not active</p>
                      <Button 
                        onClick={() => setIsCameraActive(true)}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Enable Camera
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Captured
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Review your photo. Make sure your face is clearly visible.
                  </p>
                </div>
              )}

              {/* Camera Controls */}
              {!capturedImage ? (
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Button
                    onClick={capturePhoto}
                    disabled={!isCameraActive}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-[6px] font-medium transition-all duration-200"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Photo
                  </Button>
                  
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button variant="outline" className="border-green-500 hover:border-green-600  text-green-600 hover:text-green-500 hover:bg-green-50 rounded-[6px] font-medium transition-all duration-200">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Photo
                      </Button>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Button
                    onClick={retakePhoto}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                  >
                    <RotateCw className="w-5 h-5 mr-2" />
                    Retake Photo
                  </Button>
                  
                  <Button
                    onClick={uploadPhoto}
                    disabled={uploadStatus === 'uploading'}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Set as Profile Photo
                      </>
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4 animate-in fade-in rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-green-800 mb-3">Photo Guidelines</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Ensure good lighting on your face</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Look directly at the camera</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Remove sunglasses or hats</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Keep a neutral facial expression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Make sure your entire face is visible</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Upload Status Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-green-600" />
                Upload Status
              </h2>

              {uploadStatus === 'uploading' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Uploading Your Photo</h3>
                    <p className="text-gray-600 mt-2">Uploading to Cloudinary...</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
                      <span className="text-sm">Preparing image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
                      <span className="text-sm">Uploading to Cloudinary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
                      <span className="text-sm">Updating profile</span>
                    </div>
                  </div>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-green-700">Upload Successful!</h3>
                    <p className="text-gray-600 mt-2">{uploadMessage}</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-700">
                      You will be redirected to your dashboard shortly...
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => navigate("/dashboard/profile")}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Go to Profile
                  </Button>
                </div>
              )}

              {uploadStatus === 'failed' && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-12 h-12 text-red-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-red-700">Upload Failed</h3>
                    <p className="text-gray-600 mt-2">{uploadMessage || error}</p>
                  </div>
                  
                  <Button
                    onClick={retakePhoto}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <RotateCw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {uploadStatus === 'idle' && capturedImage && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Ready to Upload</h3>
                    <p className="text-gray-600 mt-2">
                      Your photo looks good! Click "Set as Profile Photo" to upload.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-medium text-green-800 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Photo will be uploaded to Cloudinary</li>
                      <li>• Old profile photo will be replaced</li>
                      <li>• Your profile will be updated instantly</li>
                      <li>• Return to dashboard after success</li>
                    </ul>
                  </div>
                </div>
              )}

              {uploadStatus === 'idle' && !capturedImage && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Awaiting Photo Capture</h3>
                    <p className="text-gray-600 mt-2">
                      Take a clear photo using the camera or upload an existing photo.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Privacy Notice:</h4>
                    <p className="text-sm text-gray-600">
                      Your photo is used solely for your profile and is stored securely 
                      in accordance with our privacy policy.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Information */}
            <div className="bg-green-600 text-white rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-3">Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-green-100">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Photos are encrypted during upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Stored securely on Cloudinary servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Only visible to authorized personnel</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Compliance with data protection regulations</span>
                </li>
              </ul>
              
              <Button
                onClick={goBack}
                className="w-full mt-4 bg-white/20 hover:bg-white/30 border-white/30 text-white rounded-lg font-medium transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            <span className="text-green-600 font-medium">Ministry of Urban Development</span>
            <span className="mx-2">•</span>
            Profile Photo Upload
          </p>
          <p className="text-sm text-gray-400 text-center mt-1">
            Need help? Contact support@urbandevelopment.gov.ng
          </p>
        </div>
      </div>

      {/* CSS Animation for Flash */}
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.3s ease-in-out;
        }
        
        @keyframes float-shape-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
        }
        
        @keyframes float-shape-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(-180deg); }
        }
        
        .animate-float-shape-1 {
          animation: float-shape-1 20s ease-in-out infinite;
        }
        
        .animate-float-shape-2 {
          animation: float-shape-2 25s ease-in-out infinite;
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}