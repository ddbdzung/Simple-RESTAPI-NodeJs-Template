export const getCurrentDateTime = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;

  return `${h}-${m}-${s}--${dd}-${mm}-${yyyy}`
}



setInterval(() => {
  console.log(getHighResDateTime())
})