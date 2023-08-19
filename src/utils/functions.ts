// importing local storage
import { useState, useCallback } from 'react';

// local storage function that retreives the data
export async function retrieveItem(key:any) {
  try {
    const retrievedItem = localStorage.getItem(key)!;
    const item = JSON.parse(retrievedItem)!;
    return item;
  } catch (error) {
  }
  return
}


// store data in lcoalstorage
export async function storeItem(key:any, item:any) {
  try {
    var jsonOfItem = localStorage.setItem(key, JSON.stringify(item));
    return jsonOfItem;
  } catch (error) {
  }
}


//validing email
export function validateEmail(text:any) {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {

    return false;
  }
  else {
    return true;
  }
}

export function formatDate(dateObj:any) {
  var month = dateObj.getMonth() + 1;
  if (month < 10) {
      month = "0" + month;
      if (dateObj.getDate() < 10) {
          const dat = "0" + dateObj.getDate();
          let date = dateObj.getFullYear() + "-" + month + "-" + dat;
          return date
      }
      else {
          let date = dateObj.getFullYear() + "-" + month + "-" + dateObj.getDate()
          return date
      }
  }
  else {
      if (dateObj.getDate() < 10) {
          const dat = "0" + dateObj.getDate()
          let date = dateObj.getFullYear() + "-" + month + "-" + dat
          return date
      }
      else {
          let date = dateObj.getFullYear() + "-" + month + "-" + dateObj.getDate()
          return date
      }

  }
}


export const getUrgencyEnums = (number: string) => {
  if (number === "1") {
      return {title: "Urgent", color: "text-danger", "static_color":"#EF4444"}
  }
  if (number === "2") {
      return {title: "Standard", color: "text-warning", "static_color":"#f6a318"}
  }
  return {title: "Unknown", color: "text-grey"}
}

export const getStatusActive = (number: string) => {
    if (number === "1") {
        return {title: "Active", color: "text-success", "static_color":"#EF4444"}
    }
    if (number === "0") {
        return {title: "In-Active", color: "text-danger", "static_color":"#f6a318"}
    }
    return {title: "Unknown", color: "text-grey"}
  }

export const getStatusEnums = (number: string) => {
if (number === "1") {
    return {title: "Waiting for E", color: "#D97706"}
}
if (number === "2") {
    return {title: "Waiting for MP", color: "#D97706"}
}
if (number === "3") {
    return {title: "Ready to send", color: "#6366F1"}
}
if (number === "4") {
    return {title: "ASA Approved", color: "#16A34A"}
}
if (number === "5") {
    return {title: "ASA Declined", color: "#EF4444"}
}
if (number === "6") {
    return {title: "Sent to client", color: "#A3A3A3"}
}
if (number === "7") {
    return {title: "ASA Declined - Proceed with work", color: "#ff9900"}
} else {
    return {title: "Unknown", color: "text-grey"}
}
}

export const getStatusEnumsQuote = (number: string) => {
    if (number === "1") {
        return {title: "New Request", color: "#D97706"}
    }
    if (number === "2") {
        return {title: "Waiting for MP", color: "#D97706"}
    }
    if (number === "3") {
        return {title: "Ready to send", color: "#6366F1"}
    }
    if (number === "4") {
        return {title: "ASA Approved", color: "#16A34A"}
    }
    if (number === "5") {
        return {title: "ASA Declined", color: "#EF4444"}
    }
    if (number === "6") {
        return {title: "Sent to client", color: "#A3A3A3"}
    }
    if (number === "7") {
        return {title: "ASA Declined - Proceed with work", color: "#ff9900"}
    } else {
        return {title: "Unknown", color: "text-grey"}
    }
    }


export const getStatusQuote = (number: string) => {
  if (number === "1" || number === "0") {
      return {title: "New Request", color: "#fbbf24"}
  }
  if (number === "2") {
      return {title: "Revised", color: "#6266f1"}
  }
  if (number === "3") {
      return {title: "Draft", color: "#6366F1"}
  }
  if (number === "4") {
      return {title: "Approved", color: "#16A34A"}
  }
  if (number === "5") {
      return {title: "Declined", color: "#EF4444"}
  }
  if (number === "6") {
      return {title: "Sent to client", color: "#A3A3A3"}
  }
  if (number === "7") {
      return {title: "ASA Declined - Proceed with work", color: "#ff9900"}
  } else {
      return {title: "Unknown", color: "text-grey"}
  }
  }

// common Navigations



