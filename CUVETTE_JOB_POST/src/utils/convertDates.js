const convertDate = (date) => {
    const [day, month, year] = new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).split(" ");
    
    return `${day} ${month} ,${year}`;
  };
  
  export default convertDate;