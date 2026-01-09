import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProfessorCard } from './components/ProfessorCard';
import axios from 'axios';

// Backend API base URL - change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:8080/api';

export default function App() {
  // Search parameters
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  
  // Search results and state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Department list from backend
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  
  // Filter visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort states
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState('avgGPA');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [minGPA, setMinGPA] = useState('');
  const [maxDifficulty, setMaxDifficulty] = useState('');
  const [minWouldTakeAgain, setMinWouldTakeAgain] = useState('');

  // Get current year
  const currentYear = new Date().getFullYear()

  // Load departments from backend when component mounts
  useEffect(() => {
    loadDepartments();
  }, []);

  /**
   * Fetch department list from backend API
   */
  const loadDepartments = async () => {
    try {
      setDepartmentsLoading(true); 
      const response = await axios.get(`${API_BASE_URL}/departments`);
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setSearchError("Failed to load departments! Please refresh or try again later.");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  /**
   * Search for professors by department and course number
   * Calls the backend API and updates search results
   */
  const handleSearch = async () => {
    setHasSearched(true);
    setSearchResults([]);
    
    // Validate input
    if (!selectedDepartment || !courseNumber) {
      setSearchResults([]);
      setSearchError('Please select a department and enter a course number');
      return;
    }

    try {
      setSearchError('Loading...');

      // Call backend API with department and course number
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          deptName: selectedDepartment,
          courseNumber: courseNumber.toUpperCase()
        }
      });

      // Handle response
      if (response.data === null || response.data.length === 0) {
        setSearchResults([]);
        setSearchError(`No data found for ${selectedDepartment} ${courseNumber}`);
      } else {
        console.log(response.data)
        setSearchResults(response.data);
        setSearchError('');
      }
    } catch (error) {
      console.error("Failed to search:", error);
      setSearchError("Failed to reach API! Please refresh or try again later.");
      setSearchResults([]);
    } finally {
      // Finish loading!
    }
  };

  /**
   * Handle Enter key press in course number input
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Helper function to parse year from lastTaught string (e.g., "Fall 2025" -> 2025)
   */
  const getYearFromLastTaught = (lastTaught: string) => {
    const match = lastTaught?.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
  };

  /**
   * Apply all filters and sorting to the search results
   * Returns filtered and sorted array of professors
   */
  const getFilteredAndSortedResults = () => {
    let filtered = [...searchResults];

    // Filter by year last taught
    if (yearFilter !== 'all') {
      const yearsAgo = parseInt(yearFilter, 10);
      filtered = filtered.filter((prof) => {
        const year = getYearFromLastTaught(prof.lastTaught);
        return year >= currentYear - yearsAgo;
      });
    }


    // Filter by minimum GPA
    if (minGPA) {
      filtered = filtered.filter((prof) => {
        const gpa = parseFloat(prof.averageGPA);
        return !isNaN(gpa) && gpa >= parseFloat(minGPA);
      });
    }

    // Filter by maximum difficulty (if your backend provides this field)
    if (maxDifficulty && filtered.length > 0 && filtered[0].difficulty !== undefined) {
      filtered = filtered.filter((prof) => prof.difficulty <= parseFloat(maxDifficulty));
    }

    // Filter by minimum "would take again" percentage (if your backend provides this field)
    if (minWouldTakeAgain && filtered.length > 0 && filtered[0].wouldTakeAgain !== undefined) {
      filtered = filtered.filter((prof) => prof.wouldTakeAgain >= parseFloat(minWouldTakeAgain));
    }

    // Sort results based on selected criteria
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'avgGPA':
          aValue = parseFloat(a.averageGPA) || 0;
          bValue = parseFloat(b.averageGPA) || 0;
          break;
        case 'passRate':
          // If your backend provides passRate
          aValue = a.passRate || 0;
          bValue = b.passRate || 0;
          break;
        case 'difficulty':
          // If your backend provides difficulty rating
          aValue = a.difficulty || 0;
          bValue = b.difficulty || 0;
          break;
        case 'wouldTakeAgain':
          // If your backend provides wouldTakeAgain percentage
          aValue = a.wouldTakeAgain || 0;
          bValue = b.wouldTakeAgain || 0;
          break;
        case 'enrollmentCount':
          aValue = a.studentsTaught || 0;
          bValue = b.studentsTaught || 0;
          break;
        case 'lastTaught':
          aValue = getYearFromLastTaught(a.lastTaught);
          bValue = getYearFromLastTaught(b.lastTaught);
          break;
        default:
          aValue = parseFloat(a.averageGPA) || 0;
          bValue = parseFloat(b.averageGPA) || 0;
      }

      // Apply sort order
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  };

  const filteredResults = getFilteredAndSortedResults();

  /**
   * Reset all filters to their default values
   */
  const clearFilters = () => {
    setYearFilter('all');
    setSortBy('avgGPA');
    setSortOrder('desc');
    setMinGPA('');
    setMaxDifficulty('');
    setMinWouldTakeAgain('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-blue-600">UCI Course Professor Finder</h1>
          <p className="text-gray-600 mt-2">
            Search for professors by department and course number
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Department Dropdown */}
            <div className="flex-1">
              <label htmlFor="department" className="block text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {selectedDepartment === '' && <option value="">Select a department</option>}
                {departmentsLoading ? (
                  <option value="loading">Loading...</option>
                ) : (
                  departments.map((dept : any) => (
                    <option key={dept.deptCode} value={dept.deptCode}>
                      {dept.deptCode} - {dept.deptName}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Course Number Input */}
            <div className="flex-1">
              <label htmlFor="courseNumber" className="block text-gray-700 mb-2">
                Course Number
              </label>
              <input
                id="courseNumber"
                type="text"
                value={courseNumber}
                onChange={(e) => setCourseNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 45C"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>{showFilters ? 'Hide' : 'Show'} Filters & Sorting</span>
              </button>
              {(yearFilter !== 'all' || minGPA || maxDifficulty || minWouldTakeAgain || sortBy !== 'avgGPA' || sortOrder !== 'desc') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {showFilters && (
              <div className="space-y-4">
                {/* Sort Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="sortBy" className="block text-gray-700 mb-2 text-sm">
                      Sort By
                    </label>
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="avgGPA">Average GPA</option>
                      <option value="passRate">Pass Rate</option>
                      <option value="difficulty">Difficulty</option>
                      <option value="wouldTakeAgain">Would Take Again %</option>
                      <option value="enrollmentCount">Students Taught</option>
                      <option value="lastTaught">Last Taught</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sortOrder" className="block text-gray-700 mb-2 text-sm">
                      Sort Order
                    </label>
                    <select
                      id="sortOrder"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="desc">Highest to Lowest</option>
                      <option value="asc">Lowest to Highest</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="yearFilter" className="block text-gray-700 mb-2 text-sm">
                      Last Taught
                    </label>
                    <select
                      id="yearFilter"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="1">Within 1 Year</option>
                      <option value="2">Within 2 Years</option>
                      <option value="3">Within 3 Years</option>
                      <option value="5">Within 5 Years</option>
                    </select>
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label htmlFor="minGPA" className="block text-gray-700 mb-2 text-sm">
                      Minimum GPA
                    </label>
                    <input
                      id="minGPA"
                      type="number"
                      min="0"
                      max="4"
                      step="0.1"
                      value={minGPA}
                      onChange={(e) => setMinGPA(e.target.value)}
                      placeholder="e.g., 3.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxDifficulty" className="block text-gray-700 mb-2 text-sm">
                      Max Difficulty (1-5)
                    </label>
                    <input
                      id="maxDifficulty"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={maxDifficulty}
                      onChange={(e) => setMaxDifficulty(e.target.value)}
                      placeholder="e.g., 3.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="minWouldTakeAgain" className="block text-gray-700 mb-2 text-sm">
                      Min Would Take Again %
                    </label>
                    <input
                      id="minWouldTakeAgain"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={minWouldTakeAgain}
                      onChange={(e) => setMinWouldTakeAgain(e.target.value)}
                      placeholder="e.g., 75"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="mt-8">
            {searchResults.length > 0 ? (
              <>
                <h2 className="text-gray-800 mb-4">
                  Found {filteredResults.length} professor{filteredResults.length !== 1 ? 's' : ''} for{' '}
                  {selectedDepartment} {courseNumber.toUpperCase()}
                </h2>
                <div className="grid gap-4">
                  {filteredResults.map((professor, index) => (
                    <ProfessorCard key={index} professor={professor} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">
                  {searchError !== '' && `${searchError}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}