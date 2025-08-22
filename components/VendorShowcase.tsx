import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import VendorImpactDemo from "./VendorImpactDemo"

const VendorShowcase = () => {
  return (
    <Tabs defaultValue="presets" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="presets">Quick Presets</TabsTrigger>
        <TabsTrigger value="custom">Custom Selection</TabsTrigger>
        <TabsTrigger value="comparison">Visual Comparison</TabsTrigger>
        <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
      </TabsList>
      <TabsContent value="presets" className="space-y-4">
        {/* Content for Quick Presets */}
      </TabsContent>
      <TabsContent value="custom" className="space-y-4">
        {/* Content for Custom Selection */}
      </TabsContent>
      <TabsContent value="comparison" className="space-y-4">
        {/* Content for Visual Comparison */}
      </TabsContent>
      <TabsContent value="impact" className="space-y-4">
        <VendorImpactDemo 
          onVendorChange={() => {}}
          currentConfig={{
            wiredVendor: "cisco",
            wirelessVendor: "cisco", 
            firewallVendor: "cisco",
            identityProviders: ["azure_ad"],
            mdmProviders: ["intune"],
            cloudProviders: ["azure"]
          }}
        />
      </TabsContent>
    </Tabs>
  )
}

export default VendorShowcase
