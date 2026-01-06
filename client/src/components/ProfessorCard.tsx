import { User, TrendingUp, Users, Calendar, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface CourseStats {
  averageGPA: number;
  passRate: number;
  totalStudents: number;
  gradeACount: number;
  gradeBCount: number;
  gradeCCount: number;
  gradeDCount: number;
  gradeFCount: number;
}

interface Courses {
  [date: string]: CourseStats;
}

interface Stats {
  gradeACount: number;
  gradeBCount: number;
  gradeCCount: number;
  gradeDCount: number;
  gradeFCount: number;
}

interface Professor {
  shortenedName: string;        // Professor name from backend
  averageGPA: string;            // GPA as string from backend
  lastTaught: string;            // e.g., "Fall 2025"
  stats: Stats;
  studentsTaught: number;
  studentsTaughtNoPNP: number;
  courses: Courses;
  passRate?: number;             // Optional: percentage who passed
  difficulty?: number;           // Optional: difficulty rating 1-5
  wouldTakeAgain?: number;       // Optional: percentage who would take again
}

interface ProfessorCardProps {
  professor: Professor;
}

export function ProfessorCard({ professor }: ProfessorCardProps) {

  const [showHistory, setShowHistory] = useState(false);

  const formatTerm = (term: string) => {
    const [year, quarter] = term.split('-');
    return `${quarter} ${year}`;
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 bg-green-50';
    if (gpa >= 3.0) return 'text-blue-600 bg-blue-50';
    if (gpa >= 2.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  /**
   * Convert difficulty number to readable label
   */
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 4) return 'Very Hard';
    if (difficulty >= 3) return 'Hard';
    if (difficulty >= 2) return 'Moderate';
    return 'Easy';
  };

  // Parse GPA from string to number for calculations and display
  const gpaValue = parseFloat(professor.averageGPA) || 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Professor Info */}
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            {/* Display professor name from backend */}
            <h3 className="text-gray-900">{professor.shortenedName}</h3>
            <p className="text-gray-500 mt-1">Last taught: {professor.lastTaught}</p>
          </div>
        </div>

        {/* Main Stats - Always show GPA, conditionally show pass rate if available */}
        <div className="flex flex-wrap gap-4">
          {/* Average GPA - from backend */}
          <div className={`px-4 py-2 rounded-lg ${getGPAColor(gpaValue)}`}>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <div>
                <div className="text-xs opacity-75">Avg GPA</div>
                <div>{gpaValue.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Pass Rate - only show if backend provides this field */}
          {professor.passRate !== undefined && (
            <div className="px-4 py-2 rounded-lg bg-purple-50 text-purple-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <div>
                  <div className="text-xs opacity-75">Pass Rate</div>
                  <div>{(professor.passRate * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Students Taught - from backend */}
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Students Taught</span>
            </div>
            <div className="text-gray-900">{professor.studentsTaught}</div>
          </div>

          {/* Difficulty - only show if backend provides this field */}
          {professor.difficulty !== undefined && (
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Difficulty</span>
              </div>
              <div className="text-gray-900">
                {professor.difficulty.toFixed(1)} / 5.0
                <span className="text-sm text-gray-500 ml-2">
                  ({getDifficultyLabel(professor.difficulty)})
                </span>
              </div>
            </div>
          )}

          {/* Would Take Again - only show if backend provides this field */}
          {professor.wouldTakeAgain !== undefined && (
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Would Take Again</span>
              </div>
              <div className="text-gray-900">{professor.wouldTakeAgain}%</div>
            </div>
          )}

          {/* Grade Distribution - estimate based on GPA */}
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-sm">Grade Distribution</span>
            </div>
            <div className="text-gray-900 text-sm">
              A: {Math.round(professor.stats.gradeACount / professor.studentsTaughtNoPNP * 100)}% 
              <span className="text-gray-400 mx-1">|</span>
              B: {Math.round(professor.stats.gradeBCount / professor.studentsTaughtNoPNP * 100)}%
              <span className="text-gray-400 mx-1">|</span>
              C: {Math.round(professor.stats.gradeCCount / professor.studentsTaughtNoPNP * 100)}%
            </div>
          </div>
        </div>

        {/* Collapsible Course History */}
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full mt-4 hover:bg-gray-50">
              {showHistory ? (
                <>
                  <ChevronUp className="mr-2 size-4" />
                  Hide Course History
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 size-4" />
                  View Course History ({Object.keys(professor.courses).length} terms)
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        
          <CollapsibleContent className="mt-4 space-y-3">
            {Object.entries(professor.courses)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([term, courseData]) => (
                <div key={term} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{formatTerm(term)}</h4>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        <Award className="mr-1 size-3" />
                        GPA: {courseData.averageGPA.toFixed(2)}
                      </Badge>
                      <Badge variant="secondary">
                        <TrendingUp className="mr-1 size-3" />
                        Pass: {(courseData.passRate * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Grade Distribution */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 mb-2">
                      Grade Distribution ({courseData.totalStudents} students)
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="p-2 bg-green-50 rounded text-center">
                        <div className="text-green-700">A</div>
                        <div className="text-xs text-gray-600">{courseData.gradeACount}</div>
                        <div className="text-xs text-gray-500">
                          ({((courseData.gradeACount / courseData.totalStudents) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      
                      <div className="p-2 bg-blue-50 rounded text-center">
                        <div className="text-blue-700">B</div>
                        <div className="text-xs text-gray-600">{courseData.gradeBCount}</div>
                        <div className="text-xs text-gray-500">
                          ({((courseData.gradeBCount / courseData.totalStudents) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      
                      <div className="p-2 bg-yellow-50 rounded text-center">
                        <div className="text-yellow-700">C</div>
                        <div className="text-xs text-gray-600">{courseData.gradeCCount}</div>
                        <div className="text-xs text-gray-500">
                          ({((courseData.gradeCCount / courseData.totalStudents) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      
                      <div className="p-2 bg-orange-50 rounded text-center">
                        <div className="text-orange-700">D</div>
                        <div className="text-xs text-gray-600">{courseData.gradeDCount}</div>
                        <div className="text-xs text-gray-500">
                          ({((courseData.gradeDCount / courseData.totalStudents) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      
                      <div className="p-2 bg-red-50 rounded text-center">
                        <div className="text-red-700">F</div>
                        <div className="text-xs text-gray-600">{courseData.gradeFCount}</div>
                        <div className="text-xs text-gray-500">
                          ({((courseData.gradeFCount / courseData.totalStudents) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
