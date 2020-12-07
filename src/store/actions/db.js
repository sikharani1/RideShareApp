
export const db=(getFirestore)=>{
    getFirestore().enablePersistence().then(()=>{
    console.log("offline data is enabled");
    this.initTemplates();
    this.initRouter();
}
)
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once which won't allow pwa
      console.log('persistance enable failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for this pwa feature
      console.log('persistance is not available');
    }
  });
}