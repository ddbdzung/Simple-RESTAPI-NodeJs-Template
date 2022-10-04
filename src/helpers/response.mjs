const response = (code, msg, data = []) => ({
  code,
  msg,
  ...(data?.data ? data : { data }),
})

export default response