import classes from './index.module.scss'
import Image from 'next/image'

const Search = ({ value, onChange }) => {
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
