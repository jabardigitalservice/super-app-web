export default (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'")
  next()
}
