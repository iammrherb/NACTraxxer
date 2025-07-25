import React, { useState } from 'react'
import { AccessibleCarousel, StaticCarouselAlternative } from '../ui/AccessibleCarousel'
import { AccessibleInfiniteScroll, PaginatedAlternative } from '../ui/AccessibleInfiniteScroll'
import { AccessibleDropdown, NativeSelectAlternative } from '../ui/AccessibleDropdown'
import { ProgressiveWrapper, AdaptiveImage, ResponsiveText, SkipLink } from '../ui/ProgressiveEnhancement'
import { AccessibilitySettings } from '../ui/AccessibilityProvider'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

// Example data
const carouselItems = [
  {
    id: '1',
    content: (
      <div className="bg-blue-100 p-8 text-center rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Site Deployment Progress</h3>
        <p className="text-gray-600">Track your NAC deployments across multiple locations</p>
      </div>
    ),
    alt: 'Site deployment progress overview'
  },
  {
    id: '2',
    content: (
      <div className="bg-green-100 p-8 text-center rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
        <p className="text-gray-600">Real-time insights into your network security posture</p>
      </div>
    ),
    alt: 'Analytics dashboard preview'
  },
  {
    id: '3',
    content: (
      <div className="bg-purple-100 p-8 text-center rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Project Management</h3>
        <p className="text-gray-600">Streamline your deployment projects from start to finish</p>
      </div>
    ),
    alt: 'Project management tools'
  }
]

const dropdownOptions = [
  { value: 'planned', label: 'Planned', description: 'Sites in planning phase' },
  { value: 'in-progress', label: 'In Progress', description: 'Active deployments', group: 'Active' },
  { value: 'testing', label: 'Testing', description: 'Sites under testing', group: 'Active' },
  { value: 'completed', label: 'Completed', description: 'Successfully deployed sites', group: 'Finished' },
  { value: 'cancelled', label: 'Cancelled', description: 'Cancelled deployments', group: 'Finished' }
]

interface MockItem {
  id: string
  title: string
  description: string
  status: string
}

const mockItems: MockItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  title: `Deployment Site ${i + 1}`,
  description: `Description for deployment site ${i + 1}`,
  status: ['planned', 'in-progress', 'completed'][i % 3]
}))

export function AccessibilityExamples() {
  const [carouselView, setCarouselView] = useState<'carousel' | 'static'>('carousel')
  const [scrollView, setScrollView] = useState<'infinite' | 'paginated'>('infinite')
  const [dropdownView, setDropdownView] = useState<'custom' | 'native'>('custom')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedItems, setLoadedItems] = useState(mockItems.slice(0, 10))
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreItems = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const nextItems = mockItems.slice(loadedItems.length, loadedItems.length + 10)
    setLoadedItems(prev => [...prev, ...nextItems])
    setIsLoading(false)
    return nextItems
  }

  const renderItem = (item: MockItem, index: number) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-12 p-6">
      <SkipLink />
      
      <div className="max-w-4xl mx-auto">
        <ResponsiveText as="h1" className="text-3xl font-bold mb-8">
          Accessible UI Components Examples
        </ResponsiveText>

        {/* Accessibility Settings */}
        <section className="mb-12">
          <ResponsiveText as="h2" className="text-2xl font-semibold mb-4">
            Accessibility Settings
          </ResponsiveText>
          <AccessibilitySettings />
        </section>

        {/* Carousel Examples */}
        <section className="mb-12">
          <ResponsiveText as="h2" className="text-2xl font-semibold mb-4">
            Accessible Carousel vs Static Alternative
          </ResponsiveText>
          
          <div className="flex space-x-4 mb-6">
            <Button
              variant={carouselView === 'carousel' ? 'default' : 'outline'}
              onClick={() => setCarouselView('carousel')}
            >
              Interactive Carousel
            </Button>
            <Button
              variant={carouselView === 'static' ? 'default' : 'outline'}
              onClick={() => setCarouselView('static')}
            >
              Static Grid Alternative
            </Button>
          </div>

          <ProgressiveWrapper requiresJS={carouselView === 'carousel'}>
            {carouselView === 'carousel' ? (
              <AccessibleCarousel
                items={carouselItems}
                autoPlay={false}
                showDots={true}
                showArrows={true}
                ariaLabel="Feature highlights carousel"
                className="max-w-2xl"
              />
            ) : (
              <StaticCarouselAlternative
                items={carouselItems}
                className="max-w-4xl"
              />
            )}
          </ProgressiveWrapper>
        </section>

        {/* Infinite Scroll Examples */}
        <section className="mb-12">
          <ResponsiveText as="h2" className="text-2xl font-semibold mb-4">
            Accessible Infinite Scroll vs Pagination
          </ResponsiveText>
          
          <div className="flex space-x-4 mb-6">
            <Button
              variant={scrollView === 'infinite' ? 'default' : 'outline'}
              onClick={() => setScrollView('infinite')}
            >
              Infinite Scroll
            </Button>
            <Button
              variant={scrollView === 'paginated' ? 'default' : 'outline'}
              onClick={() => setScrollView('paginated')}
            >
              Paginated View
            </Button>
          </div>

          <ProgressiveWrapper requiresJS={scrollView === 'infinite'}>
            {scrollView === 'infinite' ? (
              <AccessibleInfiniteScroll
                items={loadedItems}
                loadMore={loadMoreItems}
                hasMore={loadedItems.length < mockItems.length}
                isLoading={isLoading}
                renderItem={renderItem}
                ariaLabel="Deployment sites list"
                enableManualLoad={true}
                viewMode="list"
              />
            ) : (
              <PaginatedAlternative
                items={mockItems.slice((currentPage - 1) * 10, currentPage * 10)}
                totalItems={mockItems.length}
                currentPage={currentPage}
                pageSize={10}
                onPageChange={setCurrentPage}
                renderItem={renderItem}
              />
            )}
          </ProgressiveWrapper>
        </section>

        {/* Dropdown Examples */}
        <section className="mb-12">
          <ResponsiveText as="h2" className="text-2xl font-semibold mb-4">
            Accessible Dropdown vs Native Select
          </ResponsiveText>
          
          <div className="flex space-x-4 mb-6">
            <Button
              variant={dropdownView === 'custom' ? 'default' : 'outline'}
              onClick={() => setDropdownView('custom')}
            >
              Custom Dropdown
            </Button>
            <Button
              variant={dropdownView === 'native' ? 'default' : 'outline'}
              onClick={() => setDropdownView('native')}
            >
              Native Select
            </Button>
          </div>

          <div className="max-w-md">
            <ProgressiveWrapper 
              requiresJS={dropdownView === 'custom'}
              fallback={
                <NativeSelectAlternative
                  options={dropdownOptions}
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value as string)}
                  placeholder="Select site status"
                  ariaLabel="Site status filter"
                />
              }
            >
              {dropdownView === 'custom' ? (
                <AccessibleDropdown
                  options={dropdownOptions}
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value as string)}
                  placeholder="Select site status"
                  searchable={true}
                  clearable={true}
                  ariaLabel="Site status filter"
                />
              ) : (
                <NativeSelectAlternative
                  options={dropdownOptions}
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value as string)}
                  placeholder="Select site status"
                  ariaLabel="Site status filter"
                />
              )}
            </ProgressiveWrapper>
          </div>
        </section>

        {/* Progressive Enhancement Examples */}
        <section className="mb-12">
          <ResponsiveText as="h2" className="text-2xl font-semibold mb-4">
            Progressive Enhancement Examples
          </ResponsiveText>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Adaptive Images</CardTitle>
              </CardHeader>
              <CardContent>
                <AdaptiveImage
                  src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800"
                  lowQualitySrc="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Network infrastructure visualization"
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Images adapt based on connection speed and device capabilities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsive Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ResponsiveText as="h3" className="text-lg font-semibold">
                  This heading adapts to user preferences
                </ResponsiveText>
                <ResponsiveText>
                  This paragraph text automatically adjusts size and contrast based on 
                  user accessibility settings and system preferences.
                </ResponsiveText>
                <ResponsiveText className="text-sm text-gray-600">
                  Even smaller text remains readable with proper scaling.
                </ResponsiveText>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices Summary */}
        <section className="mb-12">
          <ResponsiveText as="h2" className="text-2xl font-semibold mb-4">
            Accessibility Best Practices Implemented
          </ResponsiveText>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Arrow keys for carousel navigation</li>
                  <li>• Tab/Shift+Tab for focus management</li>
                  <li>• Enter/Space for activation</li>
                  <li>• Escape to close modals/dropdowns</li>
                  <li>• Home/End for first/last items</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Screen Reader Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Proper ARIA labels and roles</li>
                  <li>• Live regions for dynamic content</li>
                  <li>• Descriptive alt text for images</li>
                  <li>• Status announcements</li>
                  <li>• Semantic HTML structure</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Motor Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Large touch targets (44px minimum)</li>
                  <li>• Reduced motion options</li>
                  <li>• Alternative interaction methods</li>
                  <li>• Pause/play controls for auto-content</li>
                  <li>• Generous spacing between elements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cognitive Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Clear, simple language</li>
                  <li>• Consistent navigation patterns</li>
                  <li>• Error prevention and recovery</li>
                  <li>• Progress indicators</li>
                  <li>• Alternative viewing options</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}