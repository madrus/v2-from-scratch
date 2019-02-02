// src/components/TagsBlock.jsx
import React from 'react'
import { Link } from 'gatsby'

const TagsBlock = ({ list }) => {
  return (
    <div>
      <ul>
        {list &&
          list.map(tag => (
            <li key={tag}>
              <Link to={`/tags/${tag}`}>{tag}</Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default TagsBlock
