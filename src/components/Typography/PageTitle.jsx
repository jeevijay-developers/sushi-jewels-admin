import React from 'react'

const PageTitle = ({ children }) => {
  return (
    <h1 className="my-4  text-2xl hidden sm:block font-bold uppercase  text-gray-700 text-center dark:text-gray-300">{children}</h1>
  )
}

export default PageTitle
