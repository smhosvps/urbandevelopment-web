import FeatureCard from "@/components/featureCard/FeatureCard"
import { useGetFeatureSetByNameQuery } from "@/redux/features/featureSlice/featureApi"

const FeatureGrid = ({ featureSetName }:any) => {
  const { data: featureSet, isLoading, isError, error } = useGetFeatureSetByNameQuery<any>(featureSetName)

  if (isLoading) {
    return <div className="text-center py-4">Loading features...</div>
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error?.data?.message || `Failed to load ${featureSetName} features`}</p>
      </div>
    )
  }

  if (!featureSet || featureSet.features.length === 0) {
    return <div className="text-center py-4">No features available</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {featureSet.features.map((feature:any) => (
        <FeatureCard key={feature._id} feature={feature} />
      ))}
    </div>
  )
}

export default FeatureGrid

