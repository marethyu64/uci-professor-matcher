import { User, TrendingUp, Users, Calendar, Award } from 'lucide-react';

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
  passRate?: number;             // Optional: percentage who passed
  difficulty?: number;           // Optional: difficulty rating 1-5
  wouldTakeAgain?: number;       // Optional: percentage who would take again
}

interface ProfessorCardProps {
  professor: Professor;
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  /**
   * Get color styling based on GPA value
   * Higher GPA = green, lower GPA = red
   */
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
                  <div>{professor.passRate}%</div>
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
              A: {Math.round(professor.stats.gradeACount / professor.studentsTaught * 100)}% 
              <span className="text-gray-400 mx-1">|</span>
              B: {Math.round(professor.stats.gradeBCount / professor.studentsTaught * 100)}%
              <span className="text-gray-400 mx-1">|</span>
              C: {Math.round(professor.stats.gradeCCount / professor.studentsTaught * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
