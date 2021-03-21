import React from 'react'
import Shimmer from './Shimmer'
import SkeletonElement from './SkeletonElement'

const SkeletonProfile = ({ theme }) => {
  const themeClass = theme || 'light'

  return (
    <div className={`skeleton-wrapper ${themeClass}`}>
      <div className="skeleton-post">
        
        <div className="skeleton-header">
          <div className="skeleton-header-avatar">
            <SkeletonElement type="avatar" />
          </div>
          <div className="skeleton-header-description">
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
          </div>
        </div>

        <div className="skeleton-message">
          <SkeletonElement type="text" />
        </div>

        <div className="skeleton-comments">
          
          <div className="skeleton-comments-thumbnails">
            <SkeletonElement type="thumbnail" />
          </div>
          
          <div className="skeleton-comments-send">
              <div className="skeleton-comments-send-left">
                <SkeletonElement type="avatar-small" />
              </div>
              <div className="skeleton-comments-send-right">
                <SkeletonElement type="text-small" />
                <SkeletonElement type="button" />
              </div>
          </div>
        </div>
      </div>
      <Shimmer />
    </div>
  )
}

export default SkeletonProfile;
