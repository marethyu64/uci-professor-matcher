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