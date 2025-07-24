"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Brain, 
  Sparkles, 
  Target, 
  Users, 
  Building, 
  Shield, 
  Network, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Lightbulb,
  Zap
} from "lucide-react"

interface AIProjectCreatorProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreate: (projectData: any) => void
}

interface AIAnalysis {
  complexity_score: number
  estimated_duration: string
  resource_requirements: string[]
  risk_factors: string[]
  success_probability: number
  recommended_approach: string
  cost_estimate: string
  key_milestones: string[]
}

export function AIProjectCreator({ isOpen, onClose, onProjectCreate }: AIProjectCreatorProps) {
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [formData, setFormData] = useState({
    // Business Context
    organization_name: '',
    industry: '',
    company_size: '',
    annual_revenue: '',
    
    // Project Scope
    project_description: '',
    business_objectives: '',
    success_criteria: '',
    timeline_constraints: '',
    budget_range: '',
    
    // Technical Context
    current_infrastructure: '',
    security_requirements: '',
    compliance_needs: '',
    integration_requirements: '',
    
    // Stakeholder Information
    executive_sponsor: '',
    project_stakeholders: '',
    technical_team: '',
    decision_makers: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock AI analysis results based on form data
    const mockAnalysis: AIAnalysis = {
      complexity_score: Math.floor(Math.random() * 40) + 60, // 60-100
      estimated_duration: `${Math.floor(Math.random() * 8) + 12} weeks`,
      resource_requirements: [
        '1 Senior Project Manager',
        '2 Network Engineers',
        '1 Security Specialist',
        '1 Compliance Officer'
      ],
      risk_factors: [
        'Legacy system integration complexity',
        'Regulatory compliance requirements',
        'Multi-vendor environment challenges'
      ],
      success_probability: Math.floor(Math.random() * 20) + 80, // 80-100%
      recommended_approach: 'Phased deployment with pilot program',
      cost_estimate: `$${Math.floor(Math.random() * 300 + 200)}K - $${Math.floor(Math.random() * 200 + 400)}K`,
      key_milestones: [
        'Infrastructure Assessment Complete',
        'Pilot Deployment Success',
        'Security Validation Complete',
        'Production Rollout Complete'
      ]
    }
    
    setAiAnalysis(mockAnalysis)
    setIsAnalyzing(false)
    setStep(3)
  }

  const generateProject = () => {
    const projectData = {
      name: `${formData.organization_name} NAC Deployment`,
      description: formData.project_description,
      organization_name: formData.organization_name,
      industry: formData.industry,
      project_type: 'production',
      priority: 'high',
      ai_analysis: aiAnalysis,
      estimated_budget: aiAnalysis?.cost_estimate,
      estimated_duration: aiAnalysis?.estimated_duration,
      success_probability: aiAnalysis?.success_probability,
      ...formData
    }
    
    onProjectCreate(projectData)
    onClose()
  }

  const getComplexityColor = (score: number) => {
    if (score >= 90) return 'text-red-600'
    if (score >= 75) return 'text-orange-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getSuccessColor = (probability: number) => {
    if (probability >= 90) return 'text-green-600'
    if (probability >= 75) return 'text-blue-600'
    if (probability >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI-Powered Project Creator</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Information Gathering</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">AI Analysis</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Project Generation</span>
            </div>
          </div>

          {/* Step 1: Information Gathering */}
          {step === 1 && (
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Organization Context</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="org_name">Organization Name</Label>
                      <Input
                        id="org_name"
                        value={formData.organization_name}
                        onChange={(e) => handleInputChange('organization_name', e.target.value)}
                        placeholder="ACME Corporation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="financial">Financial Services</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company_size">Company Size</Label>
                      <Select value={formData.company_size} onValueChange={(value) => handleInputChange('company_size', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-50)</SelectItem>
                          <SelectItem value="small">Small (51-200)</SelectItem>
                          <SelectItem value="medium">Medium (201-1000)</SelectItem>
                          <SelectItem value="large">Large (1001-5000)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (5000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="annual_revenue">Annual Revenue</Label>
                      <Select value={formData.annual_revenue} onValueChange={(value) => handleInputChange('annual_revenue', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under_10m">Under $10M</SelectItem>
                          <SelectItem value="10m_50m">$10M - $50M</SelectItem>
                          <SelectItem value="50m_200m">$50M - $200M</SelectItem>
                          <SelectItem value="200m_1b">$200M - $1B</SelectItem>
                          <SelectItem value="over_1b">Over $1B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Project Scope & Objectives</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="project_desc">Project Description</Label>
                      <Textarea
                        id="project_desc"
                        value={formData.project_description}
                        onChange={(e) => handleInputChange('project_description', e.target.value)}
                        placeholder="Describe the NAC deployment project, its scope, and key requirements..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="business_objectives">Business Objectives</Label>
                      <Textarea
                        id="business_objectives"
                        value={formData.business_objectives}
                        onChange={(e) => handleInputChange('business_objectives', e.target.value)}
                        placeholder="What are the key business drivers and objectives for this project?"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeline">Timeline Constraints</Label>
                        <Input
                          id="timeline"
                          value={formData.timeline_constraints}
                          onChange={(e) => handleInputChange('timeline_constraints', e.target.value)}
                          placeholder="Must complete by Q4 2025"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Input
                          id="budget"
                          value={formData.budget_range}
                          onChange={(e) => handleInputChange('budget_range', e.target.value)}
                          placeholder="$500K - $1M"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="h-5 w-5" />
                      <span>Technical Requirements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current_infra">Current Infrastructure</Label>
                      <Textarea
                        id="current_infra"
                        value={formData.current_infrastructure}
                        onChange={(e) => handleInputChange('current_infrastructure', e.target.value)}
                        placeholder="Describe current network infrastructure, vendors, and technologies..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="security_reqs">Security Requirements</Label>
                      <Textarea
                        id="security_reqs"
                        value={formData.security_requirements}
                        onChange={(e) => handleInputChange('security_requirements', e.target.value)}
                        placeholder="Specific security requirements, policies, and constraints..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="compliance">Compliance Needs</Label>
                      <Textarea
                        id="compliance"
                        value={formData.compliance_needs}
                        onChange={(e) => handleInputChange('compliance_needs', e.target.value)}
                        placeholder="HIPAA, PCI-DSS, SOX, GDPR, or other compliance requirements..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stakeholders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Stakeholder Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="exec_sponsor">Executive Sponsor</Label>
                      <Input
                        id="exec_sponsor"
                        value={formData.executive_sponsor}
                        onChange={(e) => handleInputChange('executive_sponsor', e.target.value)}
                        placeholder="CTO, CISO, or other executive sponsor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stakeholders">Key Stakeholders</Label>
                      <Textarea
                        id="stakeholders"
                        value={formData.project_stakeholders}
                        onChange={(e) => handleInputChange('project_stakeholders', e.target.value)}
                        placeholder="List key stakeholders, their roles, and involvement level..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tech_team">Technical Team</Label>
                      <Textarea
                        id="tech_team"
                        value={formData.technical_team}
                        onChange={(e) => handleInputChange('technical_team', e.target.value)}
                        placeholder="Describe the technical team structure and capabilities..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.organization_name || !formData.project_description}
                >
                  Continue to AI Analysis
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Tabs>
          )}

          {/* Step 2: AI Analysis */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>AI Analysis Engine</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isAnalyzing && !aiAnalysis && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Ready for AI Analysis</h3>
                      <p className="text-muted-foreground">
                        Our AI will analyze your requirements and generate intelligent recommendations
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Complexity Assessment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Resource Planning</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Risk Analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Timeline Estimation</span>
                      </div>
                    </div>
                    <Button onClick={runAIAnalysis} className="bg-purple-600 hover:bg-purple-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Run AI Analysis
                    </Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Analyzing Your Requirements</h3>
                      <p className="text-muted-foreground">
                        AI is processing your information and generating recommendations...
                      </p>
                    </div>
                    <Progress value={66} className="w-64 mx-auto" />
                    <div className="text-sm text-muted-foreground">
                      Analyzing complexity patterns and industry best practices
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: AI Results & Project Generation */}
          {step === 3 && aiAnalysis && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                    <span>AI Analysis Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className={`h-8 w-8 ${getComplexityColor(aiAnalysis.complexity_score)}`} />
                      </div>
                      <div className="text-2xl font-bold">{aiAnalysis.complexity_score}/100</div>
                      <div className="text-sm text-muted-foreground">Complexity Score</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className={`h-8 w-8 ${getSuccessColor(aiAnalysis.success_probability)}`} />
                      </div>
                      <div className="text-2xl font-bold">{aiAnalysis.success_probability}%</div>
                      <div className="text-sm text-muted-foreground">Success Probability</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold">{aiAnalysis.estimated_duration}</div>
                      <div className="text-sm text-muted-foreground">Estimated Duration</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Resource Requirements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiAnalysis.resource_requirements.map((resource, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{resource}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Risk Factors</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiAnalysis.risk_factors.map((risk, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Cost Estimate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{aiAnalysis.cost_estimate}</div>
                      <div className="text-sm text-muted-foreground">Total Project Cost</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Key Milestones</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiAnalysis.key_milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">AI Recommendation</h4>
                      <p className="text-blue-800">{aiAnalysis.recommended_approach}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Edit
                </Button>
                <Button onClick={generateProject} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Generate Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}