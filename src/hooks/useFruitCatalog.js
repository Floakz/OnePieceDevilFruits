import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFruits from './useFruits.js';
import { filterByCategoryLocal } from '../lib/fruitsApi.js';
import { FILTER_DEFAULTS, filterAndSortFruits, readDiscoveryFilters } from '../lib/fruitDiscovery.js';

const PAGE_SIZE = 12;

export default function useFruitCatalog(category) {
    const { fruits, status, retry } = useFruits();
    const [params, setParams] = useSearchParams();
    const filters = useMemo(() => readDiscoveryFilters(params), [params]);
    const categoryFruits = useMemo(() => filterByCategoryLocal(fruits, category), [fruits, category]);
    const filtered = useMemo(() => filterAndSortFruits(categoryFruits, filters), [categoryFruits, filters]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const requested = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
    const currentPage = Math.min(requested, totalPages);
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const queryParams = Object.fromEntries(Object.entries(filters).filter(([key, value]) => value !== FILTER_DEFAULTS[key]));
    function onFilterChange(key, value) {
        setParams(previous => {
            const next = new URLSearchParams(previous);
            if (value === FILTER_DEFAULTS[key]) next.delete(key);
            else next.set(key, value);
            next.delete('page');
            return next;
        });
    }
    function clearFilters() {
        setParams(previous => {
            const next = new URLSearchParams(previous);
            Object.keys(FILTER_DEFAULTS).forEach(key => next.delete(key));
            next.delete('page');
            return next;
        });
    }
    return { categoryFruits, filtered, visible, totalPages, currentPage, filters, queryParams, onFilterChange, clearFilters, status, retry };
}
