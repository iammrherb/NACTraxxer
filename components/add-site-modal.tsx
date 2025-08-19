"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Select } from "antd"

const { Option } = Select

const AddSiteModal: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [siteType, setSiteType] = useState("")

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    setVisible(false)
    console.log("Site added:", siteType)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div>
      <button onClick={showModal}>Add Site</button>
      <Modal title="Add New Site" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Select placeholder="Select Site Type" value={siteType} onChange={(value) => setSiteType(value)}>
          <Option value="blog">Blog</Option>
          <Option value="store">Store</Option>
          <Option value="portfolio">Portfolio</Option>
        </Select>
      </Modal>
    </div>
  )
}

export default AddSiteModal
