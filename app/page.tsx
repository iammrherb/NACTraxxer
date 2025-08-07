'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Initialize the application after component mounts
    if (typeof window !== 'undefined') {
      // Define all functions first, then initialize
      defineGlobalFunctions()
      initializeApplication()
    }
  }, [])

  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portnox Deployment Tracker - ABM Industries</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        :root {
            /* Light mode variables */
            --primary-color: #1a73e8;
            --primary-dark: #174ea6;
            --secondary-color: #6c757d;
            --success-color: #0f9d58;
            --success-dark: #0a7e46;
            --danger-color: #d93025;
            --danger-dark: #b92d23;
            --warning-color: #f9ab00;
            --info-color: #17a2b8;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --planned-color: #17a2b8;
            --in-progress-color: #ff9800;
            --complete-color: #0f9d58;
            --delayed-color: #d93025;
            --portnox-teal: #00b4d8;
            
            /* Background and text colors - Light mode */
            --bg-primary: #ffffff;
            --bg-secondary: #f9f9f9;
            --bg-tertiary: #f2f2f2;
            --text-primary: #202124;
            --text-secondary: #5f6368;
            --border-color: #dadce0;
            --header-bg: linear-gradient(135deg, #1a73e8 0%, #174ea6 100%);
            --shadow-color: rgba(0, 0, 0, 0.1);
            --modal-overlay: rgba(0, 0, 0, 0.5);
            --card-bg: #ffffff;
            --hover-bg: #f1f1f1;
            --input-bg: #ffffff;
            --input-border: #dadce0;
            --table-stripe: #f9f9f9;
            --table-header: #f2f2f2;
            --checkbox-bg: #f8f9f9;
            
            /* Chart colors - Light mode */
            --chart-bg: #f5f7fb;
            --chart-border: #e3e7ef;
            --chart-text: #333333;
            --chart-grid: #dce1e8;
            --chart-accent: #1a73e8;
            
            /* Status-specific chart colors - Light mode */
            --chart-complete: #0f9d58;
            --chart-in-progress: #ff9800;
            --chart-delayed: #d93025;
            --chart-planned: #17a2b8;
            
            /* Chart gradients - Light mode */
            --chart-gradient-start: rgba(255, 255, 255, 0.2);
            --chart-gradient-end: rgba(0, 0, 0, 0.05);
            
            /* Chart shadow - Light mode */
            --chart-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            
            /* Architecture diagram colors */
            --diagram-bg: #f8f9fa;
            --diagram-border: #dee2e6;
            --diagram-node-bg: #ffffff;
            --diagram-node-border: #6c757d;
            --diagram-cloud-bg: #e3f2fd;
            --diagram-aws-bg: #fff3e0;
            --diagram-azure-bg: #e1f5fe;
            --diagram-gcp-bg: #e8f5e9;
            --diagram-site-bg: #f3e5f5;
            --diagram-intune-bg: #e1f5fe;
            --diagram-connection: #1976d2;
            --diagram-secure: #43a047;
            --diagram-text: #212529;
            --aws-orange: #ff9900;
            --azure-blue: #0078d4;
            --gcp-green: #34a853;
        }
        
        /* Dark mode variables */
        html[data-theme='dark'] {
            --primary-color: #8ab4f8;
            --primary-dark: #669df6;
            --success-color: #81c995;
            --success-dark: #5bb974;
            --danger-color: #f28b82;
            --danger-dark: #ee675c;
            --bg-primary: #1a1a1a;
            --bg-secondary: #2a2a2a;
            --bg-tertiary: #333333;
            --text-primary: #e8eaed;
            --text-secondary: #9aa0a6;
            --border-color: #5f6368;
            --header-bg: linear-gradient(135deg, #174ea6 0%, #0d47a1 100%);
            --shadow-color: rgba(0, 0, 0, 0.3);
            --modal-overlay: rgba(0, 0, 0, 0.7);
            --card-bg: #2a2a2a;
            --hover-bg: #3a3a3a;
            --input-bg: #333333;
            --input-border: #5f6368;
            --table-stripe: #2c2c2c;
            --table-header: #333333;
            --checkbox-bg: #333333;
            
            /* Chart colors - Dark mode */
            --chart-bg: #2a2a2a;
            --chart-border: #5f6368;
            --chart-text: #e8eaed;
            --chart-grid: #5f6368;
            --chart-accent: #8ab4f8;
            
            /* Status-specific chart colors - Dark mode */
            --chart-complete: #81c995;
            --chart-in-progress: #ffa726;
            --chart-delayed: #f28b82;
            --chart-planned: #26c6da;
            
            /* Chart gradients - Dark mode */
            --chart-gradient-start: rgba(255, 255, 255, 0.1);
            --chart-gradient-end: rgba(0, 0, 0, 0.2);
            
            /* Chart shadow - Dark mode */
            --chart-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            
            /* Architecture diagram colors - Dark mode */
            --diagram-bg: #2a2a2a;
            --diagram-border: #5f6368;
            --diagram-node-bg: #333333;
            --diagram-node-border: #9aa0a6;
            --diagram-cloud-bg: #1a3a52;
            --diagram-aws-bg: #3d3319;
            --diagram-azure-bg: #1a3a52;
            --diagram-gcp-bg: #1a3d23;
            --diagram-site-bg: #2a1a3d;
            --diagram-intune-bg: #1a4a5a;
            --diagram-connection: #64b5f6;
            --diagram-secure: #81c784;
            --diagram-text: #e8eaed;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text-primary);
            background-color: var(--bg-secondary);
            line-height: 1.6;
        }
        
        /* Modern Header Styles */
        .main-header {
            background: var(--header-bg);
            color: white;
            padding: 0;
            box-shadow: 0 3px 10px var(--shadow-color);
            position: relative;
        }
        
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 40px;
        }
        
        .portnox-logo-container {
            position: relative;
            height: 60px;
            display: flex;
            align-items: center;
        }
        
        .portnox-logo {
            height: 50px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            transition: transform 0.3s;
        }
        
        .portnox-logo:hover {
            transform: scale(1.05);
        }
        
        .separator {
            height: 40px;
            width: 1px;
            background-color: rgba(255,255,255,0.3);
        }
        
        .customer-logo {
            height: 50px;
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 15px;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .customer-logo:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .customer-logo img {
            max-height: 40px;
            max-width: 150px;
        }
        
        html[data-theme='dark'] .customer-logo img {
            filter: brightness(0) invert(1);
        }
        
        .app-title {
            font-size: 24px;
            font-weight: 600;
            color: white;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .header-controls {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .upload-logo {
            display: flex;
            align-items: center;
        }
        
        .upload-logo input {
            display: none;
        }
        
        .upload-logo label {
            cursor: pointer;
            padding: 8px 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 6px;
            font-size: 14px;
            color: white;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .upload-logo label:hover {
            background-color: rgba(255,255,255,0.2);
        }
        
        /* Theme toggle switch styles */
        .theme-switch-wrapper {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: white;
            gap: 8px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            transition: all 0.3s;
        }
        
        .theme-switch-wrapper:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .theme-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .theme-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.2);
            transition: .4s;
            border-radius: 30px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: var(--primary-color);
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        
        .mode-icon {
            font-size: 16px;
            transition: opacity 0.3s ease;
        }
        
        .manage-users-btn, .theme-settings {
            font-size: 14px;
            cursor: pointer;
            color: rgba(255,255,255,0.9);
            transition: color 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 6px;
        }
        
        .manage-users-btn:hover, .theme-settings:hover {
            color: white;
            background-color: rgba(255,255,255,0.2);
        }
        
        .theme-options {
            position: absolute;
            top: 100%;
            right: 20px;
            display: none;
            margin-top: 10px;
            padding: 15px;
            background-color: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 4px 15px var(--shadow-color);
            animation: fadeIn 0.3s;
            z-index: 100;
            min-width: 250px;
            border: 1px solid var(--border-color);
        }
        
        .theme-title {
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 16px;
            color: var(--text-primary);
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .color-option {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .color-option label {
            flex: 1;
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .color-option input {
            margin-left: 10px;
            cursor: pointer;
            border: none;
            height: 28px;
            width: 50px;
            padding: 0;
            border-radius: 4px;
        }
        
        /* Main content container */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Tab styles */
        .tab-container {
            margin-bottom: 20px;
        }
        
        .tabs {
            display: flex;
            border-bottom: 2px solid var(--border-color);
            overflow-x: auto;
            scrollbar-width: none;
            background: var(--bg-primary);
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            box-shadow: 0 2px 4px var(--shadow-color);
        }
        
        .tabs::-webkit-scrollbar {
            display: none;
        }
        
        .tab {
            padding: 16px 24px;
            cursor: pointer;
            background-color: var(--bg-tertiary);
            border: none;
            margin-right: 2px;
            transition: all 0.3s;
            white-space: nowrap;
            font-weight: 500;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-primary);
            position: relative;
        }
        
        .tab i {
            font-size: 16px;
        }
        
        .tab:hover {
            background-color: var(--hover-bg);
        }
        
        .tab.active {
            background-color: var(--bg-primary);
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .tab.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 3px;
            background-color: var(--primary-color);
        }
        
        .tab-content {
            display: none;
            padding: 30px;
            background-color: var(--bg-primary);
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 6px var(--shadow-color);
            animation: fadeIn 0.5s;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* Architecture Diagram Styles */
        .architecture-container {
            margin: 30px 0;
            padding: 30px;
            background: var(--diagram-bg);
            border-radius: 12px;
            border: 2px solid var(--diagram-border);
            box-shadow: 0 4px 10px var(--shadow-color);
        }
        
        .architecture-svg {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            display: block;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px var(--shadow-color);
        }
        
        .diagram-node {
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .diagram-node:hover {
            filter: brightness(1.1);
            transform: scale(1.02);
        }
        
        .connection-point {
            fill: var(--primary-color);
            stroke: white;
            stroke-width: 2;
            cursor: crosshair;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .diagram-node:hover .connection-point {
            opacity: 1;
        }
        
        .connection-point:hover {
            fill: var(--success-color);
            r: 8;
        }
        
        .connection-point.active {
            fill: var(--success-color);
            opacity: 1;
        }
        
        .diagram-connection {
            stroke: var(--diagram-connection);
            stroke-width: 2;
            fill: none;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 2s ease-out forwards;
        }
        
        .diagram-secure-connection {
            stroke: var(--diagram-secure);
            stroke-width: 3;
            stroke-dasharray: 5, 5;
            fill: none;
        }
        
        .diagram-scep-line {
            stroke: var(--portnox-teal);
            stroke-width: 2;
            stroke-dasharray: 10, 5;
            opacity: 0.7;
        }
        
        .diagram-mpls-line {
            stroke: #9c27b0;
            stroke-width: 3;
            stroke-dasharray: 8, 4;
        }
        
        .diagram-express-route {
            stroke: var(--azure-blue);
            stroke-width: 3;
        }
        
        .diagram-sd-wan {
            stroke: #ff6b6b;
            stroke-width: 2;
            stroke-dasharray: 15, 5;
        }
        
        @keyframes drawLine {
            to {
                stroke-dashoffset: 0;
            }
        }
        
        .diagram-label {
            font-size: 14px;
            fill: var(--diagram-text);
            font-weight: 500;
        }
        
        .diagram-tooltip {
            position: absolute;
            background: var(--bg-primary);
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            padding: 12px;
            font-size: 14px;
            color: var(--text-primary);
            display: none;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px var(--shadow-color);
        }
        
        .diagram-tooltip.active {
            display: block;
        }
        
        /* Architecture controls */
        .architecture-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .diagram-controls {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .diagram-btn {
            padding: 8px 16px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .diagram-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
        
        .diagram-btn.active {
            background: var(--success-color);
        }
        
        .export-svg-btn {
            padding: 8px 16px;
            background: var(--success-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .export-svg-btn:hover {
            background: var(--success-dark);
            transform: translateY(-2px);
        }
        
        .vendor-controls {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 15px;
        }
        
        .vendor-select {
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--bg-primary);
            color: var(--text-primary);
        }
        
        .cloud-provider-controls {
            display: flex;
            gap: 10px;
            margin: 15px 0;
        }
        
        .cloud-btn {
            padding: 8px 16px;
            border: 2px solid;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .cloud-btn.aws {
            border-color: var(--aws-orange);
            color: var(--aws-orange);
        }
        
        .cloud-btn.aws.active {
            background: var(--aws-orange);
            color: white;
        }
        
        .cloud-btn.azure {
            border-color: var(--azure-blue);
            color: var(--azure-blue);
        }
        
        .cloud-btn.azure.active {
            background: var(--azure-blue);
            color: white;
        }
        
        .cloud-btn.gcp {
            border-color: var(--gcp-green);
            color: var(--gcp-green);
        }
        
        .cloud-btn.gcp.active {
            background: var(--gcp-green);
            color: white;
        }
        
        .cloud-btn.onprem {
            border-color: var(--secondary-color);
            color: var(--secondary-color);
        }
        
        .cloud-btn.onprem.active {
            background: var(--secondary-color);
            color: white;
        }
        
        /* Legend styles */
        .architecture-legend {
            margin-top: 30px;
            padding: 20px;
            background: var(--bg-primary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        
        .legend-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 10px;
        }
        
        .legend-sections {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .legend-section {
            padding: 15px;
            background: var(--bg-secondary);
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }
        
        .legend-section-title {
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--primary-color);
            font-size: 16px;
        }
        
        .legend-items {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .legend-item-arch {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            padding: 5px;
            border-radius: 4px;
            transition: background 0.3s;
        }
        
        .legend-item-arch:hover {
            background: var(--hover-bg);
        }
        
        .legend-icon {
            width: 30px;
            height: 20px;
            border-radius: 4px;
            border: 2px solid;
            flex-shrink: 0;
        }
        
        .legend-description {
            color: var(--text-secondary);
            font-size: 12px;
            margin-left: 42px;
            margin-top: 2px;
        }
        
        /* Policy editor styles */
        .policy-editor {
            margin-top: 20px;
            padding: 20px;
            background: var(--bg-primary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        
        .policy-rule {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            padding: 10px;
            background: var(--bg-secondary);
            border-radius: 6px;
            align-items: center;
        }
        
        .policy-rule select, .policy-rule input {
            padding: 6px 10px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-primary);
            color: var(--text-primary);
        }
        
        .policy-action {
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 500;
        }
        
        .policy-action.allow {
            background: var(--success-color);
            color: white;
        }
        
        .policy-action.deny {
            background: var(--danger-color);
            color: white;
        }
        
        .remove-policy-btn {
            padding: 6px 10px;
            background: var(--danger-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        /* Table styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            box-shadow: 0 2px 4px var(--shadow-color);
            border-radius: 8px;
            overflow: hidden;
        }
        
        th, td {
            border: 1px solid var(--border-color);
            padding: 12px;
            text-align: left;
            font-size: 14px;
        }
        
        th {
            background-color: var(--table-header);
            font-weight: 600;
            color: var(--text-primary);
            cursor: pointer;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        th:hover {
            background-color: var(--hover-bg);
        }
        
        tr:nth-child(even) {
            background-color: var(--table-stripe);
        }
        
        tr:hover {
            background-color: var(--hover-bg);
        }
        
        /* Controls */
        .controls {
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            background: var(--bg-primary);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px var(--shadow-color);
            border: 1px solid var(--border-color);
        }
        
        .search-box {
            padding: 10px 15px;
            border: 1px solid var(--input-border);
            border-radius: 6px;
            width: 250px;
            font-size: 14px;
            transition: border-color 0.3s, box-shadow 0.3s;
            background-color: var(--input-bg);
            color: var(--text-primary);
        }
        
        .search-box:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
        }
        
        select {
            padding: 10px 15px;
            border: 1px solid var(--input-border);
            border-radius: 6px;
            background-color: var(--input-bg);
            font-size: 14px;
            transition: border-color 0.3s, box-shadow 0.3s;
            color: var(--text-primary);
            cursor: pointer;
        }
        
        select:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
        }
        
        button {
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        button:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .danger-button {
            background-color: var(--danger-color);
        }
        
        .danger-button:hover {
            background-color: var(--danger-dark);
        }
        
        .success-button {
            background-color: var(--success-color);
        }
        
        .success-button:hover {
            background-color: var(--success-dark);
        }
        
        .export-buttons {
            margin-left: auto;
            display: flex;
            gap: 10px;
        }
        
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: var(--modal-overlay);
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background-color: var(--bg-primary);
            margin: 3% auto;
            padding: 30px;
            border: none;
            width: 90%;
            max-width: 900px;
            border-radius: 12px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 5px 20px var(--shadow-color);
            animation: slideIn 0.3s;
            color: var(--text-primary);
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .close {
            color: var(--text-secondary);
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .close:hover {
            color: var(--text-primary);
        }
        
        /* Form styles */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 14px;
        }
        
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--input-border);
            border-radius: 6px;
            transition: border-color 0.3s;
            font-family: inherit;
            font-size: 14px;
            background-color: var(--input-bg);
            color: var(--text-primary);
        }
        
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.2);
        }
        
        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .form-group.full-width {
            grid-column: span 2;
        }
        
        .form-section-title {
            grid-column: span 2;
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border-color);
            color: var(--primary-color);
        }
        
        /* Dynamic vendor section */
        .vendor-manager {
            margin: 20px 0;
            padding: 15px;
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        
        .vendor-input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .vendor-input-group input {
            flex: 1;
        }
        
        .vendor-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }
        
        .vendor-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            font-size: 14px;
        }
        
        .vendor-item button {
            background: none;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--danger-color);
            font-size: 16px;
        }
        
        .vendor-item button:hover {
            transform: none;
            background: none;
        }
        
        /* Badge styles */
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            margin: 0 4px;
        }
        
        .badge-primary {
            background: var(--primary-color);
            color: white;
        }
        
        .badge-success {
            background: var(--success-color);
            color: white;
        }
        
        .badge-warning {
            background: var(--warning-color);
            color: #333;
        }
        
        .badge-danger {
            background: var(--danger-color);
            color: white;
        }
        
        .badge-high {
            background: var(--danger-color);
            color: white;
        }
        
        .badge-medium {
            background: var(--warning-color);
            color: #333;
        }
        
        .badge-low {
            background: var(--success-color);
            color: white;
        }
        
        /* Tag styles */
        .tag {
            display: inline-block;
            background-color: rgba(26, 115, 232, 0.1);
            padding: 4px 12px;
            border-radius: 20px;
            margin: 2px;
            font-size: 12px;
            transition: background-color 0.3s;
            color: var(--primary-color);
            border: 1px solid rgba(26, 115, 232, 0.2);
        }
        
        .tag:hover {
            background-color: rgba(26, 115, 232, 0.2);
        }
        
        /* Progress bar styles */
        .progress-container {
            margin: 20px 0;
            padding: 25px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--bg-primary);
            box-shadow: 0 4px 10px var(--shadow-color);
        }
        
        .progress-bar-container {
            background-color: var(--bg-tertiary);
            height: 25px;
            border-radius: 20px;
            margin-bottom: 15px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 1px 3px var(--shadow-color);
        }
        
        .progress-bar {
            height: 100%;
            background-image: linear-gradient(45deg, var(--chart-gradient-start) 25%, transparent 25%, transparent 50%, var(--chart-gradient-start) 50%, var(--chart-gradient-start) 75%, transparent 75%, transparent);
            background-size: 1rem 1rem;
            background-color: var(--primary-color);
            transition: width 1s;
            animation: progress-bar-stripes 1s linear infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 13px;
            box-shadow: 0 0 5px var(--shadow-color);
        }
        
        @keyframes progress-bar-stripes {
            from { background-position: 1rem 0; }
            to { background-position: 0 0; }
        }
        
        /* Site progress bar styles */
        .site-progress-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .site-progress-bar-container {
            flex: 1;
            background-color: var(--bg-tertiary);
            height: 16px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: inset 0 1px 2px var(--shadow-color);
        }
        
        .site-progress-bar {
            height: 100%;
            background-color: var(--primary-color);
            transition: width 1s;
            position: relative;
            overflow: hidden;
        }
        
        .site-progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: linear-gradient(45deg, var(--chart-gradient-start) 25%, transparent 25%, transparent 50%, var(--chart-gradient-start) 50%, var(--chart-gradient-start) 75%, transparent 75%, transparent);
            background-size: 1rem 1rem;
            animation: progress-bar-stripes 1s linear infinite;
        }
        
        .site-progress-bar.complete {
            background-color: var(--chart-complete);
        }
        
        .site-progress-bar.in-progress {
            background-color: var(--chart-in-progress);
        }
        
        .site-progress-bar.planned {
            background-color: var(--chart-planned);
        }
        
        .site-progress-bar.delayed {
            background-color: var(--chart-delayed);
        }
        
        .site-progress-value {
            font-size: 14px;
            min-width: 45px;
            text-align: right;
            font-weight: bold;
            color: var(--text-primary);
        }
        
        /* Chart styles */
        .chart-container {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin: 30px 0;
            justify-content: center;
        }
        
        .chart {
            width: 250px;
            height: 250px;
            position: relative;
            background-color: var(--bg-primary);
            border-radius: 50%;
            padding: 20px;
            box-shadow: var(--chart-shadow);
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid var(--border-color);
        }
        
        .chart:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px var(--shadow-color);
        }
        
        .donut-chart {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            animation: chartReveal 1.5s ease-out;
        }
        
        @keyframes chartReveal {
            0% { clip-path: polygon(50% 50%, 50% 0, 50% 0, 50% 0, 50% 0, 50% 0); }
            25% { clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 0, 100% 0, 100% 0); }
            50% { clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 100% 100%, 100% 100%); }
            75% { clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 100%); }
            100% { clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0); }
        }
        
        .donut-hole {
            position: absolute;
            width: 70%;
            height: 70%;
            background-color: var(--bg-primary);
            border-radius: 50%;
            top: 15%;
            left: 15%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0 0 10px var(--shadow-color);
            border: 1px solid var(--border-color);
        }
        
        .donut-percent {
            font-size: 32px;
            font-weight: bold;
            color: var(--text-primary);
            animation: countUp 2s ease-out;
        }
        
        @keyframes countUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .donut-label {
            font-size: 14px;
            color: var(--text-secondary);
            margin-top: 5px;
        }
        
        .chart-legend {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin-right: 15px;
            background-color: var(--bg-primary);
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            box-shadow: 0 2px 4px var(--shadow-color);
            transition: transform 0.3s;
            border: 1px solid var(--border-color);
        }
        
        .legend-item:hover {
            transform: translateY(-2px);
        }
        
        .legend-color {
            width: 15px;
            height: 15px;
            margin-right: 5px;
            border-radius: 3px;
        }
        
        .legend-complete {
            background-color: var(--chart-complete);
        }
        
        .legend-progress {
            background-color: var(--chart-in-progress);
        }
        
        .legend-delayed {
            background-color: var(--chart-delayed);
        }
        
        .legend-planned {
            background-color: var(--chart-planned);
        }
        
        /* Stats cards */
        .stats-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            flex: 1;
            min-width: 200px;
            background-color: var(--bg-primary);
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 10px var(--shadow-color);
            border-left: 4px solid var(--primary-color);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px var(--shadow-color);
        }
        
        .stat-card.complete {
            border-left-color: var(--chart-complete);
        }
        
        .stat-card.in-progress {
            border-left-color: var(--chart-in-progress);
        }
        
        .stat-card.planned {
            border-left-color: var(--chart-planned);
        }
        
        .stat-title {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 10px;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: var(--text-primary);
        }
        
        .stat-subtitle {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 5px;
        }
        
        /* Additional styles */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .feature-card {
            background: var(--card-bg);
            border-radius: 8px;
            padding: 20px;
            border: 1px solid var(--border-color);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px var(--shadow-color);
        }
        
        .highlight-box, .warning-box {
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .highlight-box {
            background: #e8f0fe;
            border-left-color: var(--primary-color);
        }
        
        html[data-theme='dark'] .highlight-box {
            background: #1a3a52;
        }
        
        .warning-box {
            background: #fef7e0;
            border-left-color: var(--warning-color);
        }
        
        html[data-theme='dark'] .warning-box {
            background: #3d3319;
        }
        
        /* Priority colors */
        .priority-high {
            background-color: rgba(217, 48, 37, 0.1);
        }
        
        .priority-medium {
            background-color: rgba(249, 171, 0, 0.1);
        }
        
        .priority-low {
            background-color: rgba(15, 157, 88, 0.1);
        }
        
        /* Status colors */
        .status-planned {
            color: var(--chart-planned);
            font-weight: 500;
        }
        
        .status-in-progress {
            color: var(--chart-in-progress);
            font-weight: bold;
        }
        
        .status-complete {
            color: var(--chart-complete);
            font-weight: bold;
        }
        
        .status-delayed {
            color: var(--chart-delayed);
            font-weight: bold;
        }
        
        /* Site workbook styles */
        .site-workbook {
            margin-top: 20px;
            padding: 30px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--bg-secondary);
            box-shadow: 0 4px 6px var(--shadow-color);
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: bold;
            width: 200px;
            color: var(--text-primary);
        }
        
        .detail-value {
            flex: 1;
            color: var(--text-primary);
        }
        
        /* Vendor sections */
        .vendor-section {
            margin-top: 15px;
            margin-bottom: 25px;
        }
        
        .vendor-title {
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 16px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .vendor-title i {
            color: var(--primary-color);
        }
        
        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 12px;
            margin-bottom: 15px;
            padding: 15px;
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        
        .checkbox-item {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            background: var(--bg-primary);
            border-radius: 6px;
            border: 1px solid var(--border-color);
            transition: all 0.2s;
        }
        
        .checkbox-item:hover {
            border-color: var(--primary-color);
            box-shadow: 0 2px 5px var(--shadow-color);
        }
        
        .checkbox-item input {
            margin-right: 8px;
        }
        
        .checkbox-item label {
            margin-bottom: 0;
            font-weight: normal;
            cursor: pointer;
            color: var(--text-primary);
        }
        
        /* User management styles */
        .user-list-container {
            margin-top: 20px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .user-list-header {
            background-color: var(--bg-tertiary);
            padding: 12px 15px;
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
        }
        
        .user-list {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .user-item {
            padding: 12px 15px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--bg-primary);
            transition: background-color 0.2s;
        }
        
        .user-item:last-child {
            border-bottom: none;
        }
        
        .user-item:hover {
            background-color: var(--hover-bg);
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .user-icon {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .user-details {
            display: flex;
            flex-direction: column;
        }
        
        .user-name {
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .user-role {
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .user-actions {
            display: flex;
            gap: 10px;
        }
        
        .user-action-btn {
            background: none;
            border: none;
            padding: 5px;
            cursor: pointer;
            color: var(--text-secondary);
            font-size: 16px;
            transition: all 0.2s;
        }
        
        .user-action-btn:hover {
            color: var(--primary-color);
            transform: translateY(0);
        }
        
        .user-action-btn.delete:hover {
            color: var(--danger-color);
        }
        
        /* Tech owner styles */
        .tech-owner-container {
            margin-top: 10px;
        }
        
        .tech-owner-entry {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            animation: fadeIn 0.3s;
            background: var(--bg-primary);
            padding: 5px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }
        
        .tech-owner-entry select {
            flex: 1;
            margin-right: 10px;
        }
        
        .remove-owner {
            color: var(--danger-color);
            cursor: pointer;
            font-size: 18px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }
        
        .remove-owner:hover {
            background-color: rgba(217, 48, 37, 0.1);
        }
        
        .add-owner-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .add-owner-btn:hover {
            background-color: var(--primary-dark);
        }
        
        /* Notes icon */
        .notes-icon {
            cursor: pointer;
            color: var(--primary-color);
            transition: transform 0.3s;
            font-size: 16px;
        }
        
        .notes-icon:hover {
            color: var(--primary-dark);
            transform: scale(1.2);
        }
        
        /* Modal footer */
        .modal-footer {
            margin-top: 25px;
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
        }
        
        /* Validation styles */
        .validation-error {
            color: var(--danger-color);
            font-size: 12px;
            margin-top: 5px;
            display: none;
        }
        
        .invalid-input {
            border-color: var(--danger-color) !important;
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        /* Table container */
        .table-container {
            overflow-x: auto;
            max-width: 100%;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px var(--shadow-color);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        
        .table-container table {
            min-width: 1500px;
        }
        
        /* Actions */
        .actions {
            display: flex;
            gap: 5px;
        }
        
        .actions button {
            padding: 6px 12px;
            font-size: 13px;
        }
        
        /* Code blocks */
        .code-block {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-x: auto;
        }
        
        pre {
            margin: 0;
            color: var(--text-primary);
        }
        
        .flow-step {
            display: flex;
            align-items: center;
            margin: 20px 0;
            opacity: 0;
            animation: fadeInSlide 0.5s ease-out forwards;
        }
        
        .flow-step:nth-child(1) { animation-delay: 0.1s; }
        .flow-step:nth-child(2) { animation-delay: 0.2s; }
        .flow-step:nth-child(3) { animation-delay: 0.3s; }
        .flow-step:nth-child(4) { animation-delay: 0.4s; }
        .flow-step:nth-child(5) { animation-delay: 0.5s; }
        .flow-step:nth-child(6) { animation-delay: 0.6s; }
        .flow-step:nth-child(7) { animation-delay: 0.7s; }
        .flow-step:nth-child(8) { animation-delay: 0.8s; }
        .flow-step:nth-child(9) { animation-delay: 0.9s; }
        
        @keyframes fadeInSlide {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .flow-icon {
            width: 60px;
            height: 60px;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 20px;
            flex-shrink: 0;
        }
        
        .flow-content {
            flex: 1;
        }
        
        .flow-title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 5px;
            color: var(--text-primary);
        }
        
        .flow-description {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .flow-arrow {
            text-align: center;
            font-size: 24px;
            color: var(--primary-color);
            margin: 10px 0;
        }
        
        .pki-flow-diagram {
            margin: 30px 0;
            padding: 20px;
            background: var(--bg-primary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .logo-container {
                flex-direction: column;
                gap: 15px;
            }
            
            .separator {
                display: none;
            }
            
            .header-controls {
                flex-direction: column;
                gap: 15px;
                width: 100%;
            }
            
            .controls {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .search-box {
                width: 100%;
            }
            
            .export-buttons {
                margin-left: 0;
                margin-top: 10px;
                width: 100%;
                justify-content: space-between;
            }
            
            .form-grid {
                grid-template-columns: 1fr;
            }
            
            .form-group.full-width {
                grid-column: span 1;
            }
            
            .modal-content {
                width: 95%;
                margin: 5% auto;
                padding: 20px;
            }
            
            .tabs {
                flex-wrap: wrap;
            }
            
            .tab {
                flex: 1 1 auto;
                min-width: 120px;
            }
            
            .feature-grid, .legend-sections {
                grid-template-columns: 1fr;
            }
            
            .architecture-controls {
                flex-direction: column;
            }
            
            .diagram-controls {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <header class="main-header">
        <div class="header-content">
            <div class="logo-container">
                <div class="portnox-logo-container">
                    <img src="https://www.portnox.com/wp-content/uploads/2021/03/Portnotx_Logo_Color-768x193.png" alt="Portnox Logo" class="portnox-logo">
                </div>
                <div class="separator"></div>
                <div class="customer-logo" id="customerLogoDisplay">
                    <img src="https://ahorrainvierte.com/wp-content/uploads/abm-industries-inc.png" alt="ABM Industries Logo">
                </div>
            </div>
            <h1 class="app-title">Portnox Deployment Tracker</h1>
            <div class="header-controls">
                <div class="upload-logo">
                    <input type="file" id="customerLogo" accept="image/*">
                    <label for="customerLogo"><i class="fas fa-upload"></i> Change Logo</label>
                </div>
                
                <label class="theme-switch-wrapper">
                    <span class="mode-icon"><i class="fas fa-sun"></i></span>
                    <div class="theme-switch">
                        <input type="checkbox" id="themeToggle">
                        <span class="slider"></span>
                    </div>
                    <span class="mode-icon"><i class="fas fa-moon"></i></span>
                </label>
                
                <div class="manage-users-btn" onclick="showTab && showTab('master-list') || openModal('userManagementModal')">
                    <i class="fas fa-users"></i> Manage Users
                </div>
                
                <div class="theme-settings" onclick="toggleThemeOptions && toggleThemeOptions()">
                    <i class="fas fa-palette"></i> Customize
                </div>
                <div id="themeOptions" class="theme-options">
                    <div class="theme-title">Customize Theme Colors</div>
                    <div class="color-option">
                        <label>Primary Color:</label>
                        <input type="color" id="primaryColor" value="#1a73e8" onchange="updateThemeColor && updateThemeColor('--primary-color', this.value)">
                    </div>
                    <div class="color-option">
                        <label>Planned Status:</label>
                        <input type="color" id="plannedColor" value="#17a2b8" onchange="updateThemeColor && updateThemeColor('--chart-planned', this.value)">
                    </div>
                    <div class="color-option">
                        <label>In Progress Status:</label>
                        <input type="color" id="inProgressColor" value="#ff9800" onchange="updateThemeColor && updateThemeColor('--chart-in-progress', this.value)">
                    </div>
                    <div class="color-option">
                        <label>Complete Status:</label>
                        <input type="color" id="completeColor" value="#0f9d58" onchange="updateThemeColor && updateThemeColor('--chart-complete', this.value)">
                    </div>
                    <div class="color-option">
                        <label>Delayed Status:</label>
                        <input type="color" id="delayedColor" value="#d93025" onchange="updateThemeColor && updateThemeColor('--chart-delayed', this.value)">
                    </div>
                </div>
            </div>
        </div>
    </header>
    
    <div class="container">
        <div class="tab-container">
            <div class="tabs">
                <div class="tab active" onclick="showTab && showTab('master-list')"><i class="fas fa-list"></i> Master Site List</div>
                <div class="tab" onclick="showTab && showTab('site-workbook')"><i class="fas fa-book"></i> Site Workbook</div>
                <div class="tab" onclick="showTab && showTab('rollout-progress')"><i class="fas fa-chart-line"></i> Rollout Progress</div>
                <div class="tab" onclick="showTab && showTab('architecture')"><i class="fas fa-sitemap"></i> Architecture</div>
            </div>
            
            <!-- Master Site List Tab -->
            <div id="master-list" class="tab-content active">
                <div class="controls">
                    <input type="text" id="searchInput" class="search-box" placeholder="Search sites...">
                    
                    <select id="regionFilter">
                        <option value="">All Regions</option>
                        <option value="EMEA">EMEA</option>
                        <option value="North America">North America</option>
                        <option value="APAC">APAC</option>
                        <option value="LATAM">LATAM</option>
                    </select>
                    
                    <select id="priorityFilter">
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    
                    <select id="phaseFilter">
                        <option value="">All Phases</option>
                        <option value="1">Phase 1</option>
                        <option value="2">Phase 2</option>
                        <option value="3">Phase 3</option>
                        <option value="4">Phase 4</option>
                    </select>
                    
                    <select id="statusFilter">
                        <option value="">All Statuses</option>
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                        <option value="Delayed">Delayed</option>
                    </select>
                    
                    <div class="export-buttons">
                        <button id="exportCSV"><i class="fas fa-file-csv"></i> Export CSV</button>
                        <button id="addSiteBtn" class="success-button"><i class="fas fa-plus"></i> Add Site</button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="siteTable">
                        <thead>
                            <tr>
                                <th onclick="sortTable && sortTable(0)">Site ID <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(1)">Site Name <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(2)">Region <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(3)">Country <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(4)">Priority <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(5)">Phase <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(6)">Users <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(7)">Project Manager <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(8)">Technical Owners <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(9)">Status <i class="fas fa-sort"></i></th>
                                <th onclick="sortTable && sortTable(10)">Completion <i class="fas fa-sort"></i></th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Table rows will be dynamically populated here -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Site Workbook Tab -->
            <div id="site-workbook" class="tab-content">
                <h2 id="workbook-title">Site Workbook: Select a site from the Master List</h2>
                
                <div id="workbook-content" class="site-workbook">
                    <p>Please select a site from the Master List tab to view its detailed workbook.</p>
                </div>
            </div>
            
            <!-- Rollout Progress Tab -->
            <div id="rollout-progress" class="tab-content">
                <h2>Overall NAC & RADIUS Rollout Progress</h2>
                
                <div class="stats-cards">
                    <div class="stat-card complete">
                        <div class="stat-title">Complete Sites</div>
                        <div class="stat-value" id="completedSitesCard">3</div>
                        <div class="stat-subtitle">of 12 total sites</div>
                    </div>
                    <div class="stat-card in-progress">
                        <div class="stat-title">In Progress</div>
                        <div class="stat-value" id="inProgressSitesCard">4</div>
                        <div class="stat-subtitle">sites being deployed</div>
                    </div>
                    <div class="stat-card planned">
                        <div class="stat-title">Planned</div>
                        <div class="stat-value" id="plannedSitesCard">5</div>
                        <div class="stat-subtitle">sites scheduled</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Total Users</div>
                        <div class="stat-value" id="totalUsersCard">9,550</div>
                        <div class="stat-subtitle">across all sites</div>
                    </div>
                </div>
                
                <div class="progress-container">
                    <h3>Total Project Completion</h3>
                    <div class="progress-bar-container">
                        <div id="overallProgressBar" class="progress-bar" style="width: 25%;">25%</div>
                    </div>
                    
                    <div class="chart-container">
                        <div class="chart">
                            <div class="donut-chart" id="statusChart">
                                <div class="donut-hole">
                                    <div class="donut-percent">25%</div>
                                    <div class="donut-label">Complete</div>
                                </div>
                            </div>
                            <div class="chart-legend">
                                <div class="legend-item">
                                    <div class="legend-color legend-complete"></div>
                                    <span>Complete</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color legend-progress"></div>
                                    <span>In Progress</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color legend-delayed"></div>
                                    <span>Delayed</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color legend-planned"></div>
                                    <span>Planned</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="chart">
                            <div class="donut-chart" id="checklistChart">
                                <div class="donut-hole">
                                    <div class="donut-percent" id="checklistPercent">45%</div>
                                    <div class="donut-label">Checklist Items</div>
                                </div>
                            </div>
                            <div class="chart-legend">
                                <div class="legend-item">
                                    <div class="legend-color legend-complete"></div>
                                    <span>Completed</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color legend-planned"></div>
                                    <span>Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="siteProgressList" class="progress-container">
                    <h3>Site Completion Status</h3>
                    <!-- Site progress list will be populated dynamically -->
                </div>
            </div>
            
            <!-- Architecture Tab -->
            <div id="architecture" class="tab-content">
                <h2>Technical Architecture</h2>
                
                <div class="highlight-box">
                    <h3>Portnox Cloud NAC Architecture for ABM Industries</h3>
                    <p>The architecture leverages Portnox's cloud-native NAC solution with RADSec proxies deployed across multiple cloud providers and on-premises for secure RADIUS communication.</p>
                </div>
                <!-- Interactive Architecture Diagram -->
                <div class="architecture-container">
                    <h3>Network Architecture Overview</h3>
                    <div class="architecture-controls">
                        <div class="diagram-controls">
                            <button class="diagram-btn active" onclick="showArchitectureView && showArchitectureView('complete')">Complete Architecture</button>
                            <button class="diagram-btn" onclick="showArchitectureView && showArchitectureView('auth-flow')">Authentication Flow</button>
                            <button class="diagram-btn" onclick="showArchitectureView && showArchitectureView('pki')">PKI & Certificate</button>
                            <button class="diagram-btn" onclick="showArchitectureView && showArchitectureView('policies')">Policies & Rules</button>
                            <button class="diagram-btn" onclick="showArchitectureView && showArchitectureView('connectivity')">Connectivity Options</button>
                        </div>
                        <button class="export-svg-btn" onclick="exportSVG && exportSVG()">
                            <i class="fas fa-download"></i> Export SVG
                        </button>
                    </div>
                    
                    <!-- Cloud Provider Selection -->
                    <div class="cloud-provider-controls">
                        <label>RADSec Proxy Location:</label>
                        <button class="cloud-btn aws" onclick="setCloudProvider && setCloudProvider('aws', event)">AWS</button>
                        <button class="cloud-btn azure active" onclick="setCloudProvider && setCloudProvider('azure', event)">Azure</button>
                        <button class="cloud-btn gcp" onclick="setCloudProvider && setCloudProvider('gcp', event)">GCP</button>
                        <button class="cloud-btn onprem" onclick="setCloudProvider && setCloudProvider('onprem', event)">On-Premises VM</button>
                    </div>
                    
                    <!-- Vendor Selection -->
                    <div class="vendor-controls">
                        <label>Network Vendor:</label>
                        <select class="vendor-select" id="networkVendorSelect" onchange="updateNetworkVendor && updateNetworkVendor(this.value)">
                            <option value="cisco">Cisco</option>
                            <option value="meraki">Cisco Meraki</option>
                            <option value="juniper">Juniper</option>
                            <option value="aruba">Aruba</option>
                            <option value="hpe">HPE</option>
                            <option value="extreme">Extreme Networks</option>
                            <option value="fortinet">Fortinet</option>
                            <option value="ruckus">Ruckus</option>
                        </select>
                        
                        <label>Connectivity Type:</label>
                        <select class="vendor-select" id="connectivitySelect" onchange="updateConnectivityType && updateConnectivityType(this.value)">
                            <option value="sdwan">SD-WAN</option>
                            <option value="expressroute">Express Route</option>
                            <option value="mpls">MPLS</option>
                            <option value="vpn">Site-to-Site VPN</option>
                            <option value="directconnect">Direct Connect</option>
                        </select>
                    </div>
                    
                    <svg class="architecture-svg" viewBox="0 0 1200 800" id="architectureDiagram">
                        <!-- Main Architecture Diagram will be drawn here -->
                    </svg>
                    
                    <!-- Comprehensive Legend -->
                    <div class="architecture-legend">
                        <h4 class="legend-title">Architecture Components Legend</h4>
                        
                        <div class="legend-sections">
                            <!-- Cloud Services Section -->
                            <div class="legend-section">
                                <div class="legend-section-title">Cloud Services</div>
                                <div class="legend-items">
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: var(--diagram-cloud-bg); border-color: var(--portnox-teal);"></div>
                                        <span><strong>Portnox Cloud</strong></span>
                                    </div>
                                    <div class="legend-description">Cloud-based NAC engine with Private PKI, policy management, and RADIUS authentication services</div>
                                    
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: var(--diagram-aws-bg); border-color: var(--aws-orange);"></div>
                                        <span><strong>AWS</strong></span>
                                    </div>
                                    <div class="legend-description">Amazon Web Services cloud infrastructure</div>
                                    
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: var(--diagram-azure-bg); border-color: var(--azure-blue);"></div>
                                        <span><strong>Azure</strong></span>
                                    </div>
                                    <div class="legend-description">Microsoft Azure cloud infrastructure</div>
                                    
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: var(--diagram-gcp-bg); border-color: var(--gcp-green);"></div>
                                        <span><strong>GCP</strong></span>
                                    </div>
                                    <div class="legend-description">Google Cloud Platform infrastructure</div>
                                </div>
                            </div>
                            
                            <!-- Network Infrastructure Section -->
                            <div class="legend-section">
                                <div class="legend-section-title">Network Infrastructure</div>
                                <div class="legend-items">
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: var(--diagram-site-bg); border-color: #6d2077;"></div>
                                        <span><strong>ABM Sites</strong></span>
                                    </div>
                                    <div class="legend-description">Physical locations with network infrastructure</div>
                                    
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: #f5f5f5; border-color: #666;"></div>
                                        <span><strong>RADSec Proxy</strong></span>
                                    </div>
                                    <div class="legend-description">RADIUS over TLS proxy with 7-day cache</div>
                                    
                                    <div class="legend-item-arch">
                                        <div class="legend-icon" style="background: #ffeaa7; border-color: #fdcb6e;"></div>
                                        <span><strong>On-Premises VM</strong></span>
                                    </div>
                                    <div class="legend-description">Virtual machine hosted in local datacenter</div>
                                </div>
                            </div>
                            
                            <!-- Connection Types Section -->
                            <div class="legend-section">
                                <div class="legend-section-title">Connection Types</div>
                                <div class="legend-items">
                                    <div class="legend-item-arch">
                                        <svg width="30" height="20">
                                            <line x1="0" y1="10" x2="30" y2="10" stroke="var(--diagram-connection)" strokeWidth="2"/>
                                        </svg>
                                        <span><strong>Standard Connection</strong></span>
                                    </div>
                                    <div class="legend-description">Regular network communication paths</div>
                                    
                                    <div class="legend-item-arch">
                                        <svg width="30" height="20">
                                            <line x1="0" y1="10" x2="30" y2="10" stroke="var(--diagram-secure)" strokeWidth="3" strokeDasharray="5,5"/>
                                        </svg>
                                        <span><strong>Secure/Encrypted</strong></span>
                                    </div>
                                    <div class="legend-description">TLS/RADSec encrypted communication</div>
                                    
                                    <div class="legend-item-arch">
                                        <svg width="30" height="20">
                                            <line x1="0" y1="10" x2="30" y2="10" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="15,5"/>
                                        </svg>
                                        <span><strong>SD-WAN</strong></span>
                                    </div>
                                    <div class="legend-description">Software-defined WAN connectivity</div>
                                    
                                    <div class="legend-item-arch">
                                        <svg width="30" height="20">
                                            <line x1="0" y1="10" x2="30" y2="10" stroke="var(--azure-blue)" strokeWidth="3"/>
                                        </svg>
                                        <span><strong>Express Route</strong></span>
                                    </div>
                                    <div class="legend-description">Azure Express Route private connection</div>
                                    
                                    <div class="legend-item-arch">
                                        <svg width="30" height="20">
                                            <line x1="0" y1="10" x2="30" y2="10" stroke="#9c27b0" strokeWidth="3" strokeDasharray="8,4"/>
                                        </svg>
                                        <span><strong>MPLS</strong></span>
                                    </div>
                                    <div class="legend-description">Multiprotocol Label Switching</div>
                                </div>
                            </div>
                            
                            <!-- Authentication Methods Section -->
                            <div class="legend-section">
                                <div class="legend-section-title">Authentication Methods</div>
                                <div class="legend-items">
                                    <div class="legend-item-arch">
                                        <i class="fas fa-certificate" style="color: var(--success-color);"></i>
                                        <span><strong>EAP-TLS</strong></span>
                                    </div>
                                    <div class="legend-description">Certificate-based authentication</div>
                                    
                                    <div class="legend-item-arch">
                                        <i class="fas fa-key" style="color: var(--info-color);"></i>
                                        <span><strong>PEAP-MSCHAPv2</strong></span>
                                    </div>
                                    <div class="legend-description">Username/password authentication</div>
                                    
                                    <div class="legend-item-arch">
                                        <i class="fas fa-fingerprint" style="color: var(--warning-color);"></i>
                                        <span><strong>MAB</strong></span>
                                    </div>
                                    <div class="legend-description">MAC Authentication Bypass for IoT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Policy Editor -->
                    <div class="policy-editor" id="policyEditor" style="display: none;">
                        <h4>Authentication Policies</h4>
                        <div id="policyRules">
                            <!-- Policy rules will be added dynamically -->
                        </div>
                        <button onclick="addPolicyRule && addPolicyRule()" class="success-button">
                            <i class="fas fa-plus"></i> Add Policy Rule
                        </button>
                    </div>
                </div>
                <!-- Certificate Enrollment Flow -->
                <div class="pki-flow-diagram">
                    <h3>Certificate Enrollment Process</h3>
                    <div class="flow-step">
                        <div class="flow-icon"><i class="fas fa-user-plus"></i></div>
                        <div class="flow-content">
                            <div class="flow-title">1. Device Enrollment</div>
                            <div class="flow-description">Device enrolled in Microsoft Intune MDM</div>
                        </div>
                    </div>
                    <div class="flow-arrow"><i class="fas fa-arrow-down"></i></div>
                    <div class="flow-step">
                        <div class="flow-icon"><i class="fas fa-cog"></i></div>
                        <div class="flow-content">
                            <div class="flow-title">2. Configuration Profile</div>
                            <div class="flow-description">Intune pushes SCEP certificate profile to device</div>
                        </div>
                    </div>
                    <div class="flow-arrow"><i class="fas fa-arrow-down"></i></div>
                    <div class="flow-step">
                        <div class="flow-icon"><i class="fas fa-certificate"></i></div>
                        <div class="flow-content">
                            <div class="flow-title">3. Certificate Request</div>
                            <div class="flow-description">Device requests certificate via SCEP from Portnox PKI</div>
                        </div>
                    </div>
                    <div class="flow-arrow"><i class="fas fa-arrow-down"></i></div>
                    <div class="flow-step">
                        <div class="flow-icon"><i class="fas fa-wifi"></i></div>
                        <div class="flow-content">
                            <div class="flow-title">4. WiFi Configuration</div>
                            <div class="flow-description">Intune deploys WiFi profile with EAP-TLS settings</div>
                        </div>
                    </div>
                    <div class="flow-arrow"><i class="fas fa-arrow-down"></i></div>
                    <div class="flow-step">
                        <div class="flow-icon"><i class="fas fa-shield-alt"></i></div>
                        <div class="flow-content">
                            <div class="flow-title">5. 802.1X Authentication</div>
                            <div class="flow-description">Device authenticates to network using certificate</div>
                        </div>
                    </div>
                </div>
                
                <div class="feature-grid">
                    <div class="feature-card">
                        <h4>☁️ Portnox Cloud Components</h4>
                        <ul>
                            <li>Cloud Network Access Control</li>
                            <li>Private PKI (Certificate Authority)</li>
                            <li>SCEP Server</li>
                            <li>OCSP Responder</li>
                            <li>Policy Management Engine</li>
                            <li>RADIUS Authentication Service</li>
                        </ul>
                    </div>
                    <div class="feature-card">
                        <h4>🔄 RADSec Proxy Options</h4>
                        <ul>
                            <li>AWS EC2 Instances</li>
                            <li>Azure Virtual Machines</li>
                            <li>Google Compute Engine</li>
                            <li>On-Premises VMware/Hyper-V</li>
                            <li>Docker Containers</li>
                            <li>Kubernetes Deployment</li>
                        </ul>
                    </div>
                    <div class="feature-card">
                        <h4>🏢 Connectivity Options</h4>
                        <ul>
                            <li>SD-WAN (Cisco Viptela, VMware)</li>
                            <li>Azure Express Route</li>
                            <li>AWS Direct Connect</li>
                            <li>Google Cloud Interconnect</li>
                            <li>MPLS Networks</li>
                            <li>Site-to-Site VPN</li>
                        </ul>
                    </div>
                    <div class="feature-card">
                        <h4>📱 Supported Vendors</h4>
                        <ul>
                            <li>Cisco (Catalyst, ISE)</li>
                            <li>Cisco Meraki</li>
                            <li>Juniper (EX, SRX)</li>
                            <li>Aruba (CX, Instant)</li>
                            <li>HPE (ProCurve, Aruba)</li>
                            <li>Extreme Networks</li>
                        </ul>
                    </div>
                </div>
                
                <h3>Authentication Workflows</h3>
                <ol>
                    <li><strong>Certificate-Based (EAP-TLS):</strong> Most secure, using X.509 certificates</li>
                    <li><strong>Username/Password (PEAP-MSCHAPv2):</strong> Legacy support for older devices</li>
                    <li><strong>MAC Authentication Bypass (MAB):</strong> For IoT and non-802.1X devices</li>
                    <li><strong>Guest Access:</strong> Captive portal with sponsor approval</li>
                    <li><strong>BYOD Onboarding:</strong> Self-service portal with certificate enrollment</li>
                </ol>
                
                <div class="warning-box">
                    <h4>Critical Deployment Considerations</h4>
                    <ul>
                        <li>RADSec proxies can be deployed in any cloud provider or on-premises</li>
                        <li>Minimum 2 proxies required for high availability</li>
                        <li>Certificate validity periods should be set to 1 year maximum</li>
                        <li>OCSP must be accessible for certificate validation</li>
                        <li>7-day cache ensures continuity during internet outages</li>
                        <li>Consider latency when choosing proxy locations</li>
                    </ul>
                </div>
                <div class="code-block"><pre>// Example Portnox RADIUS Configuration
{
  "radius_servers": {
    "primary": {
      "host": "radsec-proxy-primary.abm.internal",
      "port": 1812,
      "secret": "ENCRYPTED_SECRET_KEY",
      "timeout": 5,
      "retries": 3
    },
    "secondary": {
      "host": "radsec-proxy-secondary.abm.internal",
      "port": 1812,
      "secret": "ENCRYPTED_SECRET_KEY",
      "timeout": 5,
      "retries": 3
    }
  },
  "proxy_locations": {
    "aws_us_east": "10.100.1.10",
    "azure_us_west": "10.200.1.10",
    "gcp_us_central": "10.300.1.10",
    "onprem_datacenter": "192.168.1.10"
  },
  "authentication": {
    "methods": ["EAP-TLS", "PEAP-MSCHAPv2", "MAB"],
    "certificate_validation": true,
    "ocsp_check": true,
    "cache_timeout": 604800  // 7 days in seconds
  },
  "vlan_assignments": {
    "corporate": 100,
    "guest": 200,
    "iot": 300,
    "quarantine": 999
  }
}</pre>
                </div>
                <div id="diagram-tooltip" class="diagram-tooltip"></div>
            </div>
        </div>
    </div>
    
    <!-- Add/Edit Site Modal -->
    <div id="siteModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal && closeModal('siteModal')">&times;</span>
            <h2 id="modalTitle">Add New Site</h2>
            
            <form id="siteForm">
                <input type="hidden" id="editSiteId" value="">
                
                <div class="form-grid">
                    <div class="form-section-title">Site Information</div>
                    
                    <div class="form-group">
                        <label for="siteId">Site ID*</label>
                        <input type="text" id="siteId" required>
                        <div class="validation-error" id="siteIdError">Please enter a valid Site ID</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="siteName">Site Name*</label>
                        <input type="text" id="siteName" required>
                        <div class="validation-error" id="siteNameError">Please enter a valid Site Name</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="region">Region*</label>
                        <select id="region" required>
                            <option value="">Select Region</option>
                            <option value="North America">North America</option>
                            <option value="EMEA">EMEA</option>
                            <option value="APAC">APAC</option>
                            <option value="LATAM">LATAM</option>
                        </select>
                        <div class="validation-error" id="regionError">Please select a Region</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="country">Country*</label>
                        <input type="text" id="country" required>
                        <div class="validation-error" id="countryError">Please enter a valid Country</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="priority">Priority*</label>
                        <select id="priority" required>
                            <option value="">Select Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <div class="validation-error" id="priorityError">Please select a Priority</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="phase">Phase*</label>
                        <select id="phase" required>
                            <option value="">Select Phase</option>
                            <option value="1">Phase 1</option>
                            <option value="2">Phase 2</option>
                            <option value="3">Phase 3</option>
                            <option value="4">Phase 4</option>
                        </select>
                        <div class="validation-error" id="phaseError">Please select a Phase</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="users">Number of Users*</label>
                        <input type="number" id="users" min="1" required>
                        <div class="validation-error" id="usersError">Please enter a valid number of users</div>
                    </div>
                    
                    <div class="form-section-title">Project Management</div>
                    
                    <div class="form-group">
                        <label for="projectManager">Project Manager*</label>
                        <select id="projectManager" required>
                            <option value="">Select Project Manager</option>
                        </select>
                        <div class="validation-error" id="projectManagerError">Please select a Project Manager</div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label>Technical Owners*</label>
                        <div id="techOwnersContainer" class="tech-owner-container">
                            <!-- Technical owner fields will be added dynamically -->
                        </div>
                        <button type="button" class="add-owner-btn" onclick="addTechOwnerField && addTechOwnerField()">
                            <i class="fas fa-plus"></i> Add Technical Owner
                        </button>
                        <div class="validation-error" id="techOwnersError">At least one technical owner is required</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="plannedStart">Planned Start Date*</label>
                        <input type="date" id="plannedStart" required>
                        <div class="validation-error" id="plannedStartError">Please select a valid start date</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="plannedEnd">Planned End Date*</label>
                        <input type="date" id="plannedEnd" required>
                        <div class="validation-error" id="plannedEndError">Please select a valid end date</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="status">Status*</label>
                        <select id="status" required>
                            <option value="">Select Status</option>
                            <option value="Planned">Planned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                            <option value="Delayed">Delayed</option>
                        </select>
                        <div class="validation-error" id="statusError">Please select a Status</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="completionPercent">Completion Percentage*</label>
                        <input type="number" id="completionPercent" min="0" max="100" value="0" required>
                        <div class="validation-error" id="completionPercentError">Please enter a valid percentage (0-100)</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="radsec">RADSEC Implementation*</label>
                        <select id="radsec" required>
                            <option value="">Select RADSEC Type</option>
                            <option value="Native">Native</option>
                            <option value="LRAD">LRAD</option>
                            <option value="None">None</option>
                        </select>
                        <div class="validation-error" id="radsecError">Please select a RADSEC Implementation type</div>
                    </div>
                    
                    <div class="form-section-title">Network Vendors</div>
                    
                    <div class="form-group full-width">
                        <div class="vendor-manager">
                            <h4>Wired Network Vendors</h4>
                            <div class="vendor-input-group">
                                <input type="text" id="newWiredVendor" placeholder="Enter vendor name">
                                <button type="button" onclick="addVendor && addVendor('wired')">Add</button>
                            </div>
                            <div id="wiredVendorsList" class="vendor-list">
                                <!-- Wired vendors will be populated here -->
                            </div>
                            <input type="hidden" id="wiredVendors" value="">
                            <div class="validation-error" id="wiredVendorsError">Please add at least one wired vendor</div>
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <div class="vendor-manager">
                            <h4>Wireless Network Vendors</h4>
                            <div class="vendor-input-group">
                                <input type="text" id="newWirelessVendor" placeholder="Enter vendor name">
                                <button type="button" onclick="addVendor && addVendor('wireless')">Add</button>
                            </div>
                            <div id="wirelessVendorsList" class="vendor-list">
                                <!-- Wireless vendors will be populated here -->
                            </div>
                            <input type="hidden" id="wirelessVendors" value="">
                            <div class="validation-error" id="wirelessVendorsError">Please add at least one wireless vendor</div>
                        </div>
                    </div>
                    
                    <div class="form-section-title">Device Types</div>
                    
                    <div class="form-group full-width">
                        <div class="checkbox-group" id="deviceTypesContainer">
                            <div class="checkbox-item">
                                <input type="checkbox" id="device-windows" name="deviceTypes" value="Windows">
                                <label for="device-windows">Windows</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="device-apple" name="deviceTypes" value="Apple">
                                <label for="device-apple">Apple</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="device-mobile" name="deviceTypes" value="Mobile">
                                <label for="device-mobile">Mobile</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="device-iot" name="deviceTypes" value="IoT">
                                <label for="device-iot">IoT/MAB</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="device-guest" name="deviceTypes" value="Guest">
                                <label for="device-guest">Guest</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="device-byod" name="deviceTypes" value="BYOD">
                                <label for="device-byod">BYOD</label>
                            </div>
                        </div>
                        <div class="validation-error" id="deviceTypesError">Please select at least one device type</div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="notes">Notes</label>
                        <textarea id="notes" placeholder="Enter any special considerations, dependencies, or requirements..."></textarea>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" onclick="closeModal && closeModal('siteModal')"><i class="fas fa-times"></i> Cancel</button>
                    <button type="submit" class="success-button"><i class="fas fa-save"></i> Save Site</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Notes Modal -->
    <div id="notesModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal && closeModal('notesModal')">&times;</span>
            <h2 id="notesModalTitle">Notes for Site</h2>
            <div id="notesContent"></div>
            <div class="modal-footer">
                <button onclick="closeModal && closeModal('notesModal')"><i class="fas fa-times"></i> Close</button>
            </div>
        </div>
    </div>
    
    <!-- User Management Modal -->
    <div id="userManagementModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal && closeModal('userManagementModal')">&times;</span>
            <h2>User Management</h2>
            
            <div class="user-list-container">
                <div class="user-list-header">
                    <span>Project Managers</span>
                </div>
                <div class="user-list" id="projectManagerList">
                    <!-- Project Managers will be populated here -->
                </div>
            </div>
            
            <div class="form-group">
                <h3>Add New Project Manager</h3>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="newProjectManagerName" placeholder="Full Name" style="flex: 1;">
                    <input type="email" id="newProjectManagerEmail" placeholder="Email" style="flex: 1;">
                    <button onclick="addProjectManager && addProjectManager()" class="success-button"><i class="fas fa-plus"></i> Add</button>
                </div>
            </div>
            
            <div class="user-list-container" style="margin-top: 30px;">
                <div class="user-list-header">
                    <span>Technical Owners</span>
                </div>
                <div class="user-list" id="technicalOwnerList">
                    <!-- Technical Owners will be populated here -->
                </div>
            </div>
            
            <div class="form-group">
                <h3>Add New Technical Owner</h3>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="newTechnicalOwnerName" placeholder="Full Name" style="flex: 1;">
                    <input type="email" id="newTechnicalOwnerEmail" placeholder="Email" style="flex: 1;">
                    <select id="newTechnicalOwnerRole" style="flex: 1;">
                        <option value="">Select Role</option>
                        <option value="Network Administrator">Network Administrator</option>
                        <option value="Security Engineer">Security Engineer</option>
                        <option value="IT Manager">IT Manager</option>
                        <option value="System Administrator">System Administrator</option>
                    </select>
                    <button onclick="addTechnicalOwner && addTechnicalOwner()" class="success-button"><i class="fas fa-plus"></i> Add</button>
                </div>
            </div>
            
            <div class="modal-footer">
                <button onclick="closeModal && closeModal('userManagementModal')"><i class="fas fa-check"></i> Done</button>
            </div>
        </div>
    </div>
</body>
</html>
      `
    }} />
  )
}

// Define all global functions first
function defineGlobalFunctions() {
  // Global variables
  window.projectManagers = [
    { id: 1, name: "Alex Rivera", email: "alex.rivera@abm.com", role: "Senior Project Manager" },
    { id: 2, name: "Marcus Chen", email: "marcus.chen@abm.com", role: "Project Manager" },
    { id: 3, name: "Sofia Linden", email: "sofia.linden@abm.com", role: "Project Manager" },
    { id: 4, name: "Michael Zhang", email: "michael.zhang@abm.com", role: "Project Manager" }
  ];
  
  window.technicalOwners = [
    { id: 1, name: "John Smith", email: "john.smith@abm.com", role: "Network Administrator" },
    { id: 2, name: "Mark Wilson", email: "mark.wilson@abm.com", role: "Security Engineer" },
    { id: 3, name: "Emily Jones", email: "emily.jones@abm.com", role: "Network Engineer" },
    { id: 4, name: "Paul Davis", email: "paul.davis@abm.com", role: "IT Manager" },
    { id: 5, name: "Sarah Thompson", email: "sarah.thompson@abm.com", role: "Network Administrator" },
    { id: 6, name: "Carlos Mendez", email: "carlos.mendez@abm.com", role: "Network Engineer" }
  ];
  
  // Sample sites data
  window.sites = {
    'ABM-HQ001': {
      id: 'ABM-HQ001',
      name: 'ABM Global Headquarters',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: '1',
      users: 2500,
      projectManager: 'Alex Rivera',
      technicalOwners: ['John Smith', 'Mark Wilson'],
      wiredVendors: ['Cisco', 'Juniper'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
      radsec: 'Native',
      plannedStart: '2025-08-01',
      plannedEnd: '2025-08-15',
      status: 'In Progress',
      completionPercent: 35,
      notes: 'Executive network needs priority handling. Board room has custom AV equipment.'
    },
    'ABM-DC002': {
      id: 'ABM-DC002',
      name: 'Primary Data Center',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: '1',
      users: 150,
      projectManager: 'Marcus Chen',
      technicalOwners: ['Emily Jones', 'Paul Davis'],
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'IoT'],
      radsec: 'LRAD',
      plannedStart: '2025-08-05',
      plannedEnd: '2025-08-12',
      status: 'In Progress',
      completionPercent: 65,
      notes: '24/7 operation requires careful change windows.'
    },
    'ABM-EUR003': {
      id: 'ABM-EUR003',
      name: 'European HQ',
      region: 'EMEA',
      country: 'Germany',
      priority: 'Medium',
      phase: '2',
      users: 1200,
      projectManager: 'Sofia Linden',
      technicalOwners: ['Sarah Thompson'],
      wiredVendors: ['HPE'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Native',
      plannedStart: '2025-09-01',
      plannedEnd: '2025-09-15',
      status: 'Planned',
      completionPercent: 0,
      notes: 'GDPR compliance required.'
    }
  };
  
  // Architecture diagram variables
  window.currentArchView = 'complete';
  window.currentCloudProvider = 'azure';
  window.currentNetworkVendor = 'cisco';
  window.currentConnectivityType = 'sdwan';
  window.connectionPoints = [];
  window.isDrawingConnection = false;
  window.startPoint = null;
  window.policyRules = [];
  
  // Vendor management for sites
  window.siteWiredVendors = [];
  window.siteWirelessVendors = [];
  
  // Sort direction tracking
  window.sortDirection = {};

  // Tab switching
  window.showTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
      targetTab.classList.add('active');
    }
    
    const tabButton = document.querySelector('.tab[onclick*="' + tabId + '"]');
    if (tabButton) {
      tabButton.classList.add('active');
    }
    
    if (tabId === 'rollout-progress') {
      updateProgressData();
    } else if (tabId === 'architecture') {
      // Initialize architecture diagram
      setTimeout(() => {
        showArchitectureView('complete');
      }, 100);
    }
  };

  // Site management functions
  window.refreshSiteTable = function() {
    const tbody = document.querySelector('#siteTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    Object.values(window.sites).forEach(site => {
      const row = document.createElement('tr');
      row.className = 'priority-' + site.priority.toLowerCase();
      row.innerHTML = 
        '<td>' + site.id + '</td>' +
        '<td>' + site.name + '</td>' +
        '<td>' + site.region + '</td>' +
        '<td>' + site.country + '</td>' +
        '<td><span class="badge badge-' + site.priority.toLowerCase() + '">' + site.priority + '</span></td>' +
        '<td>Phase ' + site.phase + '</td>' +
        '<td>' + site.users.toLocaleString() + '</td>' +
        '<td>' + site.projectManager + '</td>' +
        '<td>' + site.technicalOwners.join(', ') + '</td>' +
        '<td><span class="status-' + site.status.toLowerCase().replace(' ', '-') + '">' + site.status + '</span></td>' +
        '<td>' +
          '<div class="site-progress-container">' +
            '<div class="site-progress-bar-container">' +
              '<div class="site-progress-bar ' + site.status.toLowerCase().replace(' ', '-') + '" style="width: ' + site.completionPercent + '%"></div>' +
            '</div>' +
            '<span class="site-progress-value">' + site.completionPercent + '%</span>' +
          '</div>' +
        '</td>' +
        '<td>' +
          '<i class="fas fa-sticky-note notes-icon" onclick="showNotes(\'' + site.id + '\')"></i>' +
        '</td>' +
        '<td>' +
          '<div class="actions">' +
            '<button onclick="editSite(\'' + site.id + '\')"><i class="fas fa-edit"></i></button>' +
            '<button onclick="viewSiteWorkbook(\'' + site.id + '\')"><i class="fas fa-book"></i></button>' +
            '<button class="danger-button" onclick="deleteSite(\'' + site.id + '\')"><i class="fas fa-trash"></i></button>' +
          '</div>' +
        '</td>';
      tbody.appendChild(row);
    });
  };

  window.editSite = function(siteId) {
    const site = window.sites[siteId];
    if (!site) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Site';
    document.getElementById('editSiteId').value = siteId;
    document.getElementById('siteId').value = site.id;
    document.getElementById('siteName').value = site.name;
    document.getElementById('region').value = site.region;
    document.getElementById('country').value = site.country;
    document.getElementById('priority').value = site.priority;
    document.getElementById('phase').value = site.phase;
    document.getElementById('users').value = site.users;
    document.getElementById('projectManager').value = site.projectManager;
    document.getElementById('plannedStart').value = site.plannedStart;
    document.getElementById('plannedEnd').value = site.plannedEnd;
    document.getElementById('status').value = site.status;
    document.getElementById('completionPercent').value = site.completionPercent;
    document.getElementById('radsec').value = site.radsec;
    document.getElementById('notes').value = site.notes;
    
    // Set vendors
    window.siteWiredVendors = site.wiredVendors || [];
    window.siteWirelessVendors = site.wirelessVendors || [];
    displayVendors('wired');
    displayVendors('wireless');
    
    // Set device types
    document.querySelectorAll('input[name="deviceTypes"]').forEach(checkbox => {
      checkbox.checked = site.deviceTypes.includes(checkbox.value);
    });
    
    // Set technical owners
    const techOwnersContainer = document.getElementById('techOwnersContainer');
    techOwnersContainer.innerHTML = '';
    site.technicalOwners.forEach(owner => {
      addTechOwnerField(owner);
    });
    
    openModal('siteModal');
  };

  window.deleteSite = function(siteId) {
    if (confirm('Are you sure you want to delete site ' + siteId + '?')) {
      delete window.sites[siteId];
      refreshSiteTable();
      updateProgressData();
    }
  };

  window.viewSiteWorkbook = function(siteId) {
    const site = window.sites[siteId];
    if (!site) return;
    
    showTab('site-workbook');
    
    document.getElementById('workbook-title').textContent = 'Site Workbook: ' + site.name;
    
    const workbookContent = document.getElementById('workbook-content');
    workbookContent.innerHTML = 
      '<div class="detail-row">' +
        '<div class="detail-label">Site ID:</div>' +
        '<div class="detail-value">' + site.id + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Site Name:</div>' +
        '<div class="detail-value">' + site.name + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Region:</div>' +
        '<div class="detail-value">' + site.region + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Country:</div>' +
        '<div class="detail-value">' + site.country + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Priority:</div>' +
        '<div class="detail-value"><span class="badge badge-' + site.priority.toLowerCase() + '">' + site.priority + '</span></div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Phase:</div>' +
        '<div class="detail-value">Phase ' + site.phase + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Number of Users:</div>' +
        '<div class="detail-value">' + site.users.toLocaleString() + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Project Manager:</div>' +
        '<div class="detail-value">' + site.projectManager + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Technical Owners:</div>' +
        '<div class="detail-value">' + site.technicalOwners.join(', ') + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">RADSEC Implementation:</div>' +
        '<div class="detail-value">' + site.radsec + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Planned Start Date:</div>' +
        '<div class="detail-value">' + site.plannedStart + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Planned End Date:</div>' +
        '<div class="detail-value">' + site.plannedEnd + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Status:</div>' +
        '<div class="detail-value"><span class="status-' + site.status.toLowerCase().replace(' ', '-') + '">' + site.status + '</span></div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Completion:</div>' +
        '<div class="detail-value">' +
          '<div class="site-progress-container">' +
            '<div class="site-progress-bar-container">' +
              '<div class="site-progress-bar ' + site.status.toLowerCase().replace(' ', '-') + '" style="width: ' + site.completionPercent + '%"></div>' +
            '</div>' +
            '<span class="site-progress-value">' + site.completionPercent + '%</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Wired Vendors:</div>' +
        '<div class="detail-value">' + site.wiredVendors.join(', ') + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Wireless Vendors:</div>' +
        '<div class="detail-value">' + site.wirelessVendors.join(', ') + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Device Types:</div>' +
        '<div class="detail-value">' + site.deviceTypes.map(type => '<span class="tag">' + type + '</span>').join('') + '</div>' +
      '</div>' +
      '<div class="detail-row">' +
        '<div class="detail-label">Notes:</div>' +
        '<div class="detail-value">' + (site.notes || 'No notes available') + '</div>' +
      '</div>';
  };

  window.showNotes = function(siteId) {
    const site = window.sites[siteId];
    if (!site) return;
    
    document.getElementById('notesModalTitle').textContent = 'Notes for ' + site.name;
    document.getElementById('notesContent').innerHTML = 
      '<p><strong>Site ID:</strong> ' + site.id + '</p>' +
      '<p><strong>Notes:</strong></p>' +
      '<p>' + (site.notes || 'No notes available for this site.') + '</p>';
    
    openModal('notesModal');
  };

  // Vendor management functions
  window.addVendor = function(type) {
    const inputId = type === 'wired' ? 'newWiredVendor' : 'newWirelessVendor';
    const vendorName = document.getElementById(inputId).value.trim();
    
    if (!vendorName) {
      alert('Please enter a vendor name');
      return;
    }
    
    const vendorList = type === 'wired' ? window.siteWiredVendors : window.siteWirelessVendors;
    
    if (!vendorList.includes(vendorName)) {
      vendorList.push(vendorName);
      displayVendors(type);
      document.getElementById(inputId).value = '';
    } else {
      alert('This vendor has already been added');
    }
  };

  window.removeVendor = function(type, vendor) {
    if (type === 'wired') {
      window.siteWiredVendors = window.siteWiredVendors.filter(v => v !== vendor);
    } else {
      window.siteWirelessVendors = window.siteWirelessVendors.filter(v => v !== vendor);
    }
    displayVendors(type);
  };

  window.displayVendors = function(type) {
    const containerId = type === 'wired' ? 'wiredVendorsList' : 'wirelessVendorsList';
    const container = document.getElementById(containerId);
    const vendorList = type === 'wired' ? window.siteWiredVendors : window.siteWirelessVendors;
    
    if (!container) return;
    
    container.innerHTML = '';
    vendorList.forEach(vendor => {
      const vendorItem = document.createElement('div');
      vendorItem.className = 'vendor-item';
      vendorItem.innerHTML = 
        '<span>' + vendor + '</span>' +
        '<button type="button" onclick="removeVendor(\'' + type + '\', \'' + vendor + '\')">' +
          '<i class="fas fa-times"></i>' +
        '</button>';
      container.appendChild(vendorItem);
    });
    
    // Update hidden input
    const hiddenInput = document.getElementById(type + 'Vendors');
    if (hiddenInput) {
      hiddenInput.value = vendorList.join(',');
    }
  };

  // Technical owner field management
  window.addTechOwnerField = function(selectedValue = '') {
    const container = document.getElementById('techOwnersContainer');
    if (!container) return;
    
    const entry = document.createElement('div');
    entry.className = 'tech-owner-entry';
    
    const select = document.createElement('select');
    select.className = 'tech-owner-select';
    select.innerHTML = '<option value="">Select Technical Owner</option>';
    
    window.technicalOwners.forEach(owner => {
      const option = document.createElement('option');
      option.value = owner.name;
      option.textContent = owner.name + ' (' + owner.role + ')';
      if (owner.name === selectedValue) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-owner';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = function() {
      entry.remove();
    };
    
    entry.appendChild(select);
    entry.appendChild(removeBtn);
    container.appendChild(entry);
  };

  // User management functions
  window.renderProjectManagerList = function() {
    const container = document.getElementById('projectManagerList');
    if (!container) return;
    
    container.innerHTML = '';
    
    window.projectManagers.forEach(pm => {
      const userItem = document.createElement('div');
      userItem.className = 'user-item';
      userItem.innerHTML = 
        '<div class="user-info">' +
          '<div class="user-icon">' + pm.name.split(' ').map(n => n[0]).join('') + '</div>' +
          '<div class="user-details">' +
            '<div class="user-name">' + pm.name + '</div>' +
            '<div class="user-role">' + pm.email + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="user-actions">' +
          '<button class="user-action-btn delete" onclick="deleteProjectManager(' + pm.id + ')">' +
            '<i class="fas fa-trash"></i>' +
          '</button>' +
        '</div>';
      container.appendChild(userItem);
    });
    
    // Update project manager dropdown
    const pmSelect = document.getElementById('projectManager');
    if (pmSelect) {
      pmSelect.innerHTML = '<option value="">Select Project Manager</option>';
      window.projectManagers.forEach(pm => {
        const option = document.createElement('option');
        option.value = pm.name;
        option.textContent = pm.name;
        pmSelect.appendChild(option);
      });
    }
  };

  window.renderTechnicalOwnerList = function() {
    const container = document.getElementById('technicalOwnerList');
    if (!container) return;
    
    container.innerHTML = '';
    
    window.technicalOwners.forEach(to => {
      const userItem = document.createElement('div');
      userItem.className = 'user-item';
      userItem.innerHTML = 
        '<div class="user-info">' +
          '<div class="user-icon">' + to.name.split(' ').map(n => n[0]).join('') + '</div>' +
          '<div class="user-details">' +
            '<div class="user-name">' + to.name + '</div>' +
            '<div class="user-role">' + to.role + ' - ' + to.email + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="user-actions">' +
          '<button class="user-action-btn delete" onclick="deleteTechnicalOwner(' + to.id + ')">' +
            '<i class="fas fa-trash"></i>' +
          '</button>' +
        '</div>';
      container.appendChild(userItem);
    });
  };

  window.addProjectManager = function() {
    const name = document.getElementById('newProjectManagerName').value.trim();
    const email = document.getElementById('newProjectManagerEmail').value.trim();
    
    if (!name || !email) {
      alert('Please enter both name and email');
      return;
    }
    
    const newPM = {
      id: Date.now(),
      name: name,
      email: email,
      role: 'Project Manager'
    };
    
    window.projectManagers.push(newPM);
    renderProjectManagerList();
    
    document.getElementById('newProjectManagerName').value = '';
    document.getElementById('newProjectManagerEmail').value = '';
  };

  window.addTechnicalOwner = function() {
    const name = document.getElementById('newTechnicalOwnerName').value.trim();
    const email = document.getElementById('newTechnicalOwnerEmail').value.trim();
    const role = document.getElementById('newTechnicalOwnerRole').value;
    
    if (!name || !email || !role) {
      alert('Please enter name, email, and role');
      return;
    }
    
    const newTO = {
      id: Date.now(),
      name: name,
      email: email,
      role: role
    };
    
    window.technicalOwners.push(newTO);
    renderTechnicalOwnerList();
    
    document.getElementById('newTechnicalOwnerName').value = '';
    document.getElementById('newTechnicalOwnerEmail').value = '';
    document.getElementById('newTechnicalOwnerRole').value = '';
  };

  window.deleteProjectManager = function(id) {
    if (confirm('Are you sure you want to delete this project manager?')) {
      window.projectManagers = window.projectManagers.filter(pm => pm.id !== id);
      renderProjectManagerList();
    }
  };

  window.deleteTechnicalOwner = function(id) {
    if (confirm('Are you sure you want to delete this technical owner?')) {
      window.technicalOwners = window.technicalOwners.filter(to => to.id !== id);
      renderTechnicalOwnerList();
    }
  };

  // Progress tracking functions
  window.updateProgressData = function() {
    const siteArray = Object.values(window.sites);
    
    const completedSites = siteArray.filter(s => s.status === 'Complete').length;
    const inProgressSites = siteArray.filter(s => s.status === 'In Progress').length;
    const plannedSites = siteArray.filter(s => s.status === 'Planned').length;
    const delayedSites = siteArray.filter(s => s.status === 'Delayed').length;
    const totalUsers = siteArray.reduce((sum, s) => sum + s.users, 0);
    
    const completedCard = document.getElementById('completedSitesCard');
    const inProgressCard = document.getElementById('inProgressSitesCard');
    const plannedCard = document.getElementById('plannedSitesCard');
    const totalUsersCard = document.getElementById('totalUsersCard');
    
    if (completedCard) completedCard.textContent = completedSites;
    if (inProgressCard) inProgressCard.textContent = inProgressSites;
    if (plannedCard) plannedCard.textContent = plannedSites;
    if (totalUsersCard) totalUsersCard.textContent = totalUsers.toLocaleString();
    
    const totalSites = siteArray.length;
    const overallPercent = totalSites > 0 ? Math.round((completedSites / totalSites) * 100) : 0;
    
    const progressBar = document.getElementById('overallProgressBar');
    if (progressBar) {
      progressBar.style.width = overallPercent + '%';
      progressBar.textContent = overallPercent + '%';
    }
    
    // Update donut chart
    updateDonutChart(completedSites, inProgressSites, plannedSites, delayedSites);
    
    // Update site progress list
    updateSiteProgressList();
  };

  window.updateDonutChart = function(completed, inProgress, planned, delayed) {
    const total = completed + inProgress + planned + delayed;
    const completePercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const donutPercent = document.querySelector('#statusChart .donut-percent');
    if (donutPercent) {
      donutPercent.textContent = completePercent + '%';
    }
    
    // Update checklist chart (simulated)
    const checklistPercent = Math.round((completed * 100 + inProgress * 50) / (total * 100) * 100);
    const checklistElement = document.getElementById('checklistPercent');
    if (checklistElement) {
      checklistElement.textContent = checklistPercent + '%';
    }
  };

  window.updateSiteProgressList = function() {
    const container = document.getElementById('siteProgressList');
    if (!container) return;
    
    const siteArray = Object.values(window.sites);
    
    let html = '<h3>Site Completion Status</h3>';
    
    siteArray.forEach(site => {
      html += 
        '<div style="margin: 15px 0;">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">' +
            '<span style="font-weight: 500;">' + site.name + '</span>' +
            '<span class="status-' + site.status.toLowerCase().replace(' ', '-') + '">' + site.status + '</span>' +
          '</div>' +
          '<div class="site-progress-container">' +
            '<div class="site-progress-bar-container">' +
              '<div class="site-progress-bar ' + site.status.toLowerCase().replace(' ', '-') + '" style="width: ' + site.completionPercent + '%"></div>' +
            '</div>' +
            '<span class="site-progress-value">' + site.completionPercent + '%</span>' +
          '</div>' +
        '</div>';
    });
    
    container.innerHTML = html;
  };

  // Filter functionality
  window.filterTable = function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const regionFilter = document.getElementById('regionFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const phaseFilter = document.getElementById('phaseFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#siteTable tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const region = row.cells[2].textContent;
      const priority = row.cells[4].textContent;
      const phase = row.cells[5].textContent.replace('Phase ', '');
      const status = row.cells[9].textContent;
      
      const matchesSearch = text.includes(searchTerm);
      const matchesRegion = !regionFilter || region === regionFilter;
      const matchesPriority = !priorityFilter || priority === priorityFilter;
      const matchesPhase = !phaseFilter || phase === phaseFilter;
      const matchesStatus = !statusFilter || status === statusFilter;
      
      if (matchesSearch && matchesRegion && matchesPriority && matchesPhase && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  // Sort functionality
  window.sortTable = function(columnIndex) {
    const table = document.getElementById('siteTable');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const direction = window.sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
    window.sortDirection[columnIndex] = direction;
    
    rows.sort((a, b) => {
      let aValue = a.cells[columnIndex].textContent;
      let bValue = b.cells[columnIndex].textContent;
      
      // Handle numeric columns
      if (columnIndex === 5) { // Phase
        aValue = parseInt(aValue.replace('Phase ', ''));
        bValue = parseInt(bValue.replace('Phase ', ''));
      } else if (columnIndex === 6 || columnIndex === 10) { // Users, Completion
        aValue = parseInt(aValue.replace(/[,%]/g, ''));
        bValue = parseInt(bValue.replace(/[,%]/g, ''));
      }
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
  };

  // Form validation
  window.validateSiteForm = function() {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = [
      'siteId', 'siteName', 'region', 'country', 'priority',
      'phase', 'users', 'projectManager', 'plannedStart',
      'plannedEnd', 'status', 'completionPercent', 'radsec'
    ];
    
    requiredFields.forEach(field => {
      const element = document.getElementById(field);
      const errorElement = document.getElementById(field + 'Error');
      
      if (element && !element.value) {
        element.classList.add('invalid-input');
        if (errorElement) errorElement.style.display = 'block';
        isValid = false;
      } else if (element && errorElement) {
        element.classList.remove('invalid-input');
        errorElement.style.display = 'none';
      }
    });
    
    // Validate vendors
    if (window.siteWiredVendors.length === 0) {
      const errorElement = document.getElementById('wiredVendorsError');
      if (errorElement) errorElement.style.display = 'block';
      isValid = false;
    } else {
      const errorElement = document.getElementById('wiredVendorsError');
      if (errorElement) errorElement.style.display = 'none';
    }
    
    if (window.siteWirelessVendors.length === 0) {
      const errorElement = document.getElementById('wirelessVendorsError');
      if (errorElement) errorElement.style.display = 'block';
      isValid = false;
    } else {
      const errorElement = document.getElementById('wirelessVendorsError');
      if (errorElement) errorElement.style.display = 'none';
    }
    
    // Validate device types
    const deviceTypes = document.querySelectorAll('input[name="deviceTypes"]:checked');
    if (deviceTypes.length === 0) {
      const errorElement = document.getElementById('deviceTypesError');
      if (errorElement) errorElement.style.display = 'block';
      isValid = false;
    } else {
      const errorElement = document.getElementById('deviceTypesError');
      if (errorElement) errorElement.style.display = 'none';
    }
    
    // Validate technical owners
    const techOwners = document.querySelectorAll('.tech-owner-select');
    if (techOwners.length === 0 || !Array.from(techOwners).some(select => select.value)) {
      const errorElement = document.getElementById('techOwnersError');
      if (errorElement) errorElement.style.display = 'block';
      isValid = false;
    } else {
      const errorElement = document.getElementById('techOwnersError');
      if (errorElement) errorElement.style.display = 'none';
    }
    
    return isValid;
  };

  // Modal functions
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      
      if (modalId === 'userManagementModal') {
        renderProjectManagerList();
        renderTechnicalOwnerList();
      }
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  };

  // Theme customization
  window.toggleThemeOptions = function() {
    const themeOptions = document.getElementById('themeOptions');
    if (themeOptions) {
      themeOptions.style.display = themeOptions.style.display === 'block' ? 'none' : 'block';
    }
  };

  window.updateThemeColor = function(variable, value) {
    document.documentElement.style.setProperty(variable, value);
    
    if (variable === '--primary-color') {
      const darkerColor = adjustColorBrightness(value, -20);
      document.documentElement.style.setProperty('--primary-dark', darkerColor);
    }
  };

  window.adjustColorBrightness = function(hex, percent) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
  };

  // Architecture diagram functions
  window.showArchitectureView = function(view) {
    window.currentArchView = view;
    
    // Update button states
    document.querySelectorAll('.diagram-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const clickedBtn = document.querySelector('.diagram-btn[onclick*="' + view + '"]');
    if (clickedBtn) clickedBtn.classList.add('active');
    
    // Show/hide policy editor
    const policyEditor = document.getElementById('policyEditor');
    if (view === 'policies') {
      if (policyEditor) policyEditor.style.display = 'block';
      if (window.policyRules.length === 0) {
        // Add default policy rules
        addPolicyRule('Corporate Users', 'EAP-TLS', 'Certificate Valid', 'Allow', 'VLAN 100');
        addPolicyRule('Guest Users', 'Captive Portal', 'Sponsor Approved', 'Allow', 'VLAN 200');
        addPolicyRule('IoT Devices', 'MAB', 'MAC Registered', 'Allow', 'VLAN 300');
      }
    } else {
      if (policyEditor) policyEditor.style.display = 'none';
    }
    
    // Draw the appropriate diagram
    const svg = document.getElementById('architectureDiagram');
    if (svg) {
      svg.innerHTML = '';
      window.connectionPoints = [];
      
      switch(view) {
        case 'complete':
          drawCompleteArchitecture(svg);
          break;
        case 'auth-flow':
          drawAuthFlowDiagram(svg);
          break;
        case 'pki':
          drawPKIDiagram(svg);
          break;
        case 'policies':
          drawPoliciesDiagram(svg);
          break;
        case 'connectivity':
          drawConnectivityDiagram(svg);
          break;
      }
    }
  };

  window.drawCompleteArchitecture = function(svg) {
    // Simple placeholder diagram
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '100');
    rect.setAttribute('y', '100');
    rect.setAttribute('width', '200');
    rect.setAttribute('height', '100');
    rect.setAttribute('fill', '#e3f2fd');
    rect.setAttribute('stroke', '#1976d2');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '160');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '16');
    text.setAttribute('font-weight', 'bold');
    text.textContent = 'Portnox Cloud';
    svg.appendChild(text);
  };

  window.drawAuthFlowDiagram = function(svg) {
    // Simple placeholder for auth flow
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '160');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '16');
    text.textContent = 'Authentication Flow Diagram';
    svg.appendChild(text);
  };

  window.drawPKIDiagram = function(svg) {
    // Simple placeholder for PKI
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '160');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '16');
    text.textContent = 'PKI Infrastructure Diagram';
    svg.appendChild(text);
  };

  window.drawPoliciesDiagram = function(svg) {
    // Simple placeholder for policies
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '160');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '16');
    text.textContent = 'Policies & Rules Diagram';
    svg.appendChild(text);
  };

  window.drawConnectivityDiagram = function(svg) {
    // Simple placeholder for connectivity
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '160');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '16');
    text.textContent = 'Connectivity Options Diagram';
    svg.appendChild(text);
  };

  window.setCloudProvider = function(provider, event) {
    window.currentCloudProvider = provider;
    document.querySelectorAll('.cloud-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    showArchitectureView(window.currentArchView);
  };

  window.updateNetworkVendor = function(vendor) {
    window.currentNetworkVendor = vendor;
    showArchitectureView(window.currentArchView);
  };

  window.updateConnectivityType = function(type) {
    window.currentConnectivityType = type;
    showArchitectureView(window.currentArchView);
  };

  window.exportSVG = function() {
    const svg = document.getElementById('architectureDiagram');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'portnox-architecture-' + window.currentArchView + '-' + Date.now() + '.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Policy management functions
  window.addPolicyRule = function(userGroup = '', authMethod = '', condition = '', action = '', vlan = '') {
    const ruleId = 'rule-' + Date.now();
    const rule = {
      id: ruleId,
      userGroup,
      authMethod,
      condition,
      action,
      vlan
    };
    
    window.policyRules.push(rule);
    displayPolicyRules();
  };

  window.displayPolicyRules = function() {
    const container = document.getElementById('policyRules');
    if (!container) return;
    
    container.innerHTML = '';
    
    window.policyRules.forEach(rule => {
      const ruleDiv = document.createElement('div');
      ruleDiv.className = 'policy-rule';
      ruleDiv.innerHTML = 
        '<select value="' + rule.userGroup + '">' +
          '<option value="">Select Group</option>' +
          '<option value="Corporate Users"' + (rule.userGroup === 'Corporate Users' ? ' selected' : '') + '>Corporate Users</option>' +
          '<option value="Guest Users"' + (rule.userGroup === 'Guest Users' ? ' selected' : '') + '>Guest Users</option>' +
          '<option value="IoT Devices"' + (rule.userGroup === 'IoT Devices' ? ' selected' : '') + '>IoT Devices</option>' +
          '<option value="BYOD"' + (rule.userGroup === 'BYOD' ? ' selected' : '') + '>BYOD</option>' +
        '</select>' +
        '<select value="' + rule.authMethod + '">' +
          '<option value="">Auth Method</option>' +
          '<option value="EAP-TLS"' + (rule.authMethod === 'EAP-TLS' ? ' selected' : '') + '>EAP-TLS</option>' +
          '<option value="PEAP-MSCHAPv2"' + (rule.authMethod === 'PEAP-MSCHAPv2' ? ' selected' : '') + '>PEAP-MSCHAPv2</option>' +
          '<option value="MAB"' + (rule.authMethod === 'MAB' ? ' selected' : '') + '>MAB</option>' +
          '<option value="Captive Portal"' + (rule.authMethod === 'Captive Portal' ? ' selected' : '') + '>Captive Portal</option>' +
        '</select>' +
        '<input type="text" placeholder="Condition" value="' + rule.condition + '">' +
        '<div class="policy-action ' + (rule.action === 'Allow' ? 'allow' : 'deny') + '">' + (rule.action || 'Allow') + '</div>' +
        '<input type="text" placeholder="VLAN" value="' + rule.vlan + '" style="width: 100px;">' +
        '<button class="remove-policy-btn" onclick="removePolicyRule(\'' + rule.id + '\')">' +
          '<i class="fas fa-trash"></i>' +
        '</button>';
      container.appendChild(ruleDiv);
    });
  };

  window.removePolicyRule = function(ruleId) {
    window.policyRules = window.policyRules.filter(rule => rule.id !== ruleId);
    displayPolicyRules();
  };
}

// Initialize the application
function initializeApplication() {
  // Initialize the application
  refreshSiteTable();
  updateProgressData();
  renderProjectManagerList();
  renderTechnicalOwnerList();
  
  // Initialize event listeners
  initializeEventListeners();
}

// Initialize Event Listeners
function initializeEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Customer logo upload
  const customerLogo = document.getElementById('customerLogo');
  if (customerLogo) {
    customerLogo.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const logoDisplay = document.getElementById('customerLogoDisplay');
          if (logoDisplay) {
            logoDisplay.innerHTML = '<img src="' + e.target.result + '" alt="Customer Logo">';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Export CSV functionality
  const exportCSV = document.getElementById('exportCSV');
  if (exportCSV) {
    exportCSV.addEventListener('click', function() {
      const siteArray = Object.values(window.sites);
      let csv = 'Site ID,Site Name,Region,Country,Priority,Phase,Users,Project Manager,Technical Owners,Status,Completion %,RADSEC,Notes\n';
      
      siteArray.forEach(site => {
        csv += '"' + site.id + '","' + site.name + '","' + site.region + '","' + site.country + '","' + site.priority + '","' + site.phase + '","' + site.users + '","' + site.projectManager + '","' + site.technicalOwners.join(', ') + '","' + site.status + '","' + site.completionPercent + '","' + site.radsec + '","' + site.notes + '"\n';
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portnox-deployment-' + Date.now() + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
  
  // Add Site button functionality
  const addSiteBtn = document.getElementById('addSiteBtn');
  if (addSiteBtn) {
    addSiteBtn.addEventListener('click', function() {
      document.getElementById('modalTitle').textContent = 'Add New Site';
      document.getElementById('siteForm').reset();
      document.getElementById('editSiteId').value = '';
      document.getElementById('techOwnersContainer').innerHTML = '';
      window.siteWiredVendors = [];
      window.siteWirelessVendors = [];
      displayVendors('wired');
      displayVendors('wireless');
      addTechOwnerField();
      openModal('siteModal');
    });
  }
  
  // Filter functionality
  const searchInput = document.getElementById('searchInput');
  const regionFilter = document.getElementById('regionFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const phaseFilter = document.getElementById('phaseFilter');
  const statusFilter = document.getElementById('statusFilter');
  
  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (regionFilter) regionFilter.addEventListener('change', filterTable);
  if (priorityFilter) priorityFilter.addEventListener('change', filterTable);
  if (phaseFilter) phaseFilter.addEventListener('change', filterTable);
  if (statusFilter) statusFilter.addEventListener('change', filterTable);
  
  // Form handling
  const siteForm = document.getElementById('siteForm');
  if (siteForm) {
    siteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateSiteForm()) {
        return;
      }
      
      const editingSiteId = document.getElementById('editSiteId').value;
      const siteId = document.getElementById('siteId').value;
      
      const siteData = {
        id: siteId,
        name: document.getElementById('siteName').value,
        region: document.getElementById('region').value,
        country: document.getElementById('country').value,
        priority: document.getElementById('priority').value,
        phase: document.getElementById('phase').value,
        users: parseInt(document.getElementById('users').value),
        projectManager: document.getElementById('projectManager').value,
        technicalOwners: Array.from(document.querySelectorAll('.tech-owner-select')).map(select => select.value).filter(v => v),
        wiredVendors: window.siteWiredVendors,
        wirelessVendors: window.siteWirelessVendors,
        deviceTypes: Array.from(document.querySelectorAll('input[name="deviceTypes"]:checked')).map(cb => cb.value),
        radsec: document.getElementById('radsec').value,
        plannedStart: document.getElementById('plannedStart').value,
        plannedEnd: document.getElementById('plannedEnd').value,
        status: document.getElementById('status').value,
        completionPercent: parseInt(document.getElementById('completionPercent').value),
        notes: document.getElementById('notes').value
      };
      
      // If editing, delete the old site if the ID changed
      if (editingSiteId && editingSiteId !== siteId) {
        delete window.sites[editingSiteId];
      }
      
      window.sites[siteId] = siteData;
      
      refreshSiteTable();
      updateProgressData();
      closeModal('siteModal');
      
      // Reset form
      document.getElementById('siteForm').reset();
      document.getElementById('editSiteId').value = '';
      window.siteWiredVendors = [];
      window.siteWirelessVendors = [];
    });
  }
  
  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  };
}
