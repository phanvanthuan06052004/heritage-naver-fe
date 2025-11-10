import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search } from 'lucide-react'
import HeritageMapView from './HeritageMapView'
import HeritageList from '~/components/Heritage/HeritageList'
import { Input } from '~/components/common/ui/Input'
import { cn } from '~/lib/utils'
import { useLazyGetNearestHeritagesQuery } from '~/store/apis/heritageApi'

function GenericMapExplorer({
    items = [],
    itemName = 'Heritage',
    locationName = 'location',
    initialCenter = { lat: 16.047079, lng: 108.20623 },
}) {
    const [mapCenter, setMapCenter] = useState(initialCenter)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchError, setSearchError] = useState(null)
    const [nearbyItems, setNearbyItems] = useState(items)
    const [displayedItems, setDisplayedItems] = useState(items)

    // RTK Query: Lazy query for nearest heritages
    const [triggerGetNearestHeritages, { data: nearestHeritages, isLoading, isError, error }] =
        useLazyGetNearestHeritagesQuery()

    // Memoize nearestHeritages to stabilize reference
    const stableNearestHeritages = useMemo(() => nearestHeritages || [], [nearestHeritages])

    // Handle marker click
    const handleMarkerClick = useCallback(
        async ({ lat, lng }) => {
            if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.log('Invalid marker coordinates:', { lat, lng })
                return
            }

            const newLocation = { lat, lng }
            setSelectedLocation(newLocation)
            setMapCenter(newLocation)

            try {
                const { data } = await triggerGetNearestHeritages({ latitude: lat, longitude: lng, limit: 6 })
                // console.log('Data from getNearestHeritages (marker click):', data || 'No data')
                setNearbyItems(data || [])
            } catch (err) {
                console.error('Error calling getNearestHeritages (marker):', err)
            }
        },
        [triggerGetNearestHeritages]
    )

    // Handle select button click (from "Select" button)
    const handleSelectCoordinates = useCallback(
        async (coordinates) => {
            if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
                // console.log('Invalid coordinates from "Select" button:', coordinates)
                return
            }

            const { lat, lng } = coordinates
            // console.log('Preparing to fetch API with coordinates:', { lat, lng })

            const newLocation = { lat, lng }
            setSelectedLocation(newLocation)
            setMapCenter(newLocation)

            try {
                const { data } = await triggerGetNearestHeritages({ latitude: lat, longitude: lng, limit: 6 })
                // console.log('Data from getNearestHeritages (select button):', data || 'No data')
                setNearbyItems(data || [])
            } catch (err) {
                console.error('Error calling getNearestHeritages (select):', err)
            }
        },
        [triggerGetNearestHeritages]
    )

    // Handle print coordinates
    const handlePrintCoordinates = useCallback((coordinates) => {
        if (coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number') {
            // console.log(`Tọa độ: Lat: ${coordinates.lat.toFixed(6)}, Lng: ${coordinates.lng.toFixed(6)}`)
        } else {
            console.log('Chưa chọn tọa độ hoặc tọa độ không hợp lệ:', coordinates)
        }
    }, [])

    // Handle search submission
    const handleSearch = useCallback(
        async (e) => {
            e.preventDefault()
            if (!searchQuery.trim()) return

            setSearchError(null)

            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        searchQuery
                    )}.json?access_token=pk.eyJ1IjoibmFtbGUwMjIwMDQiLCJhIjoiY205ejlmYm94MHI1djJqb2w5czloNDdrbyJ9.-P_PHQN7L283Z_qIGfgsOg`
                )
                const data = await response.json()

                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center
                    if (typeof lat !== 'number' || typeof lng !== 'number') {
                        console.log('Invalid search coordinates:', { lat, lng })
                        setSearchError('Invalid coordinates.')
                        return
                    }

                    const newLocation = { lat, lng }
                    setMapCenter(newLocation)
                    setSelectedLocation(newLocation)

                    try {
                        const { data: searchData } = await triggerGetNearestHeritages({
                            latitude: lat,
                            longitude: lng,
                            limit: 6,
                        })
                        console.log('Data from getNearestHeritages (search):', searchData || 'No data')
                        setNearbyItems(searchData?.heritages?.heritages || [])
                        setDisplayedItems(searchData?.heritages?.heritages || [])
                    } catch (err) {
                        console.error('Error calling getNearestHeritages (search):', err)
                    }
                } else {
                    setSearchError('Location not found.')
                }
            } catch (error) {
                setSearchError('Error searching for location.')
                console.error('Search error:', error)
            }
        },
        [searchQuery, triggerGetNearestHeritages]
    )

    // Update displayed and nearby items
    useEffect(() => {
        if (JSON.stringify(items) !== JSON.stringify(displayedItems)) {
            setDisplayedItems(items)
        }
        if (!selectedLocation && JSON.stringify(items) !== JSON.stringify(nearbyItems)) {
            setNearbyItems(items)
        } else if (selectedLocation && stableNearestHeritages && stableNearestHeritages !== nearbyItems) {
            setNearbyItems(stableNearestHeritages)
        }
    }, [items, selectedLocation, stableNearestHeritages, displayedItems, nearbyItems])

    // Memoize markers
    const markers = useMemo(
        () =>
            displayedItems
                .filter(
                    (item) =>
                        item.coordinates &&
                        typeof item.coordinates.latitude === 'number' &&
                        typeof item.coordinates.longitude === 'number'
                )
                .map((item) => ({
                    lat: item.coordinates.latitude,
                    lng: item.coordinates.longitude,
                    title: item.name || 'Unknown',
                })),
        [displayedItems]
    )

    return (
        <div className="min-h-screen bg-background lcn-container-x pt-navbar-mobile sm:pt-navbar">
            <div className={cn('container mx-auto py-8')}>
                <div className="flex flex-col space-y-6">

                    {/* Map Section */}
                    <div className="h-[400px] rounded-lg overflow-hidden border border-border">
                        <HeritageMapView
                            center={mapCenter}
                            markers={markers}
                            onMarkerClick={handleMarkerClick}
                            onPrintCoordinates={handlePrintCoordinates}
                            onSelectCoordinates={handleSelectCoordinates}
                        />
                    </div>

                    {/* Item Lists */}
                    <div className="space-y-6">
                        {isLoading && selectedLocation ? (
                            <p>Loading data...</p>
                        ) : isError && selectedLocation ? (
                            <p>Error loading data: {error.message}</p>
                        ) : selectedLocation || searchQuery ? (
                            <>
                                <h2 className="text-xl font-medium text-heritage-dark">
                                    {searchQuery ? `Search results for ${itemName}` : `${itemName} near ${locationName}`}
                                </h2>
                                <HeritageList heritages={nearbyItems?.heritages} />
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GenericMapExplorer
