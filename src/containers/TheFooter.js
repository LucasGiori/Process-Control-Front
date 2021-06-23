import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span className="ml-1">&copy; 2021 Process Control.</span>
      </div>
      <div className="mfs-auto">
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">Lucas Giori Cesconetto</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
