
export const db=(getFirestore)=>{
    getFirestore().enablePersistence().then(()=>{
    console.log("offline data enabled");
}
)
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });
}