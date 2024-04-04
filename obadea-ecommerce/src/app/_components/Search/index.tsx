import React, { useState } from 'react'
import classes from './index.module.scss'
import Image from 'next/image'

const Search = ({ value, onChange }) => {
  //   const [searchText, setSearchText] = useState('')

  //   const [searchedResults, setSearchedResults] = useState([])
  //   const [allPosts, setAllPosts] = useState([])
  //   const [searchTimeout, setSearchTimeout] = useState(null)

  //   const filterPrompts = searchtext => {
  //     const regex = new RegExp(searchtext, 'i') // 'i' flag for case-insensitive search
  //     return allPosts.filter(
  //       item => regex.test(item.name) || regex.test(item.description) || regex.test(item.category),
  //     )
  //   }

  //   // let searchResult;

  //   const handleSearchChange = e => {
  //     clearTimeout(searchTimeout)
  //     setSearchText(e.target.value)
  //     // debounce method
  //     setSearchTimeout(
  //       setTimeout(() => {
  //         const searchResult = filterPrompts(e.target.value)
  //         setSearchedResults(searchResult)
  //         // console.log(searchResult);
  //       }, 500),
  //     )
  //   }

  return (
    <div className={classes.searchContainer}>
      <Image
        className={classes.image}
        src="/assets/icons/search.svg"
        alt="search"
        width={24}
        height={24}
      />
      <input
        className={classes.input}
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Search
