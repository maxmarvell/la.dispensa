
const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."


const Review = () => {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div>{sample}</div>
      <div className="flex text-xs space-x-5">
        <div className="uppercase">maxmarvell</div>
        <div className="uppercase">01/01/2001</div>
      </div>
    </div>
  )
}


const Reviews = () => {
  return (
    <div className="flex-col divide-y my-6">
      <Review />
      <Review />
      <Review />
      <Review />
      <Review />
      <Review />
      <Review />
    </div>
  )
}

export default Reviews