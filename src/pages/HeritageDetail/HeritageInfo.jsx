
const HeritageInfo = ({ data }) => {
  return (
    <div className='border rounded-lg p-6 sticky top-24'>
      <h3 className='lcn-heritage-detail-title mb-4'>Detailed Information</h3>
      <dl className='space-y-4'>
        <div>
          <dt className='text-sm text-muted-foreground'>Address</dt>
          <dd className='font-medium'>{data?.location}</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>Title</dt>
          <dd className='font-medium'>National Heritage Site</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>Coordinates</dt>
          <dd className='font-medium'>
            {data?.coordinates?.latitude}, {data?.coordinates?.longitude}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default HeritageInfo
