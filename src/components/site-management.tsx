import type React from "react"
import { Select } from "antd"
import { Form } from "antd"

const { Option } = Select

const SiteManagement: React.FC = () => {
  const regions = [
    { label: "North America", value: "na" },
    { label: "South America", value: "sa" },
    { label: "Europe", value: "eu" },
    { label: "Asia", value: "as" },
    { label: "Africa", value: "af" },
    { label: "Australia", value: "au" },
  ]

  const vendors = [
    { label: "Vendor A", value: "vendorA" },
    { label: "Vendor B", value: "vendorB" },
    { label: "Vendor C", value: "vendorC" },
  ]

  return (
    <Form>
      <Form.Item label="Region">
        <Select placeholder="Select a region">
          {regions.map((region) => (
            <Option key={region.value} value={region.value}>
              {region.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Vendor">
        <Select placeholder="Select a vendor">
          {vendors.map((vendor) => (
            <Option key={vendor.value} value={vendor.value}>
              {vendor.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* rest of code here */}
    </Form>
  )
}

export default SiteManagement
