import { useMemo, useState } from "react"

const useQuery = () => {
    const [query, setQuery] = useState("")
    return { query, setQuery }
}

const useFilter = (items, query) => {
    return useMemo(() => {
        if (!items || !Array.isArray(items) || items.length === 0 || !query.trim()) {
            return items || []
        }
        
        const lowerQuery = query.toLowerCase().trim()
        return items.filter(item =>
            item?.fullname?.toLowerCase().includes(lowerQuery) 
        )
    }, [items, query])
}

const useSearch = (items) => {
    const { query, setQuery } = useQuery()
    const filteredItems = useFilter(items, query)
    
    return { 
        query, 
        setQuery, 
        filteredItems,
        hasResults: filteredItems.length > 0,
        resultCount: filteredItems.length
    }
}

export default useSearch