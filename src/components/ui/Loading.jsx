import { motion } from 'framer-motion'

const Loading = ({ className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="card p-4">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Task skeletons */}
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-4"
        >
          <div className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex space-x-2">
                    <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        
        .animate-pulse {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 400% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}

export default Loading