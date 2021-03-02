import React from "react";
import { withRouter } from "react-router-dom";
import styles from "../css/Home.module.scss";
import { connect } from "react-redux";
import ProjectList from "./project/ProjectList";

class Home extends React.Component {  
  constructor (props) {
    super(props);    
    this.state = {
      isLoading: true,
      // projects: [],
      totalProjects: 0
    };
    
    //this.fetchProjects = this.fetchProjects.bind(this);
  }

  // async fetchProjects (page) {
  //   console.log("aaabbb");
  //   this.setState({isLoading: true});    
  //   await fetch('https://risk-module-api.herokuapp.com/api/v1/projects?page=' + page, {
  //     headers: new Headers({
  //       /*'Access-Control-Allow-Origin':'*',
  //       'Access-Control-Allow-Methods':'DELETE, POST, GET, OPTIONS',
  //       'Access-Control-Allow-Headers':'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',*/
  //       'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MDg2NTQ3MDUsImV4cCI6MTYxMjI1NDcwNSwicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.s05_i9SAxQ_IPFa9AB_DJ0UcV9sCdPWeB3W_PTKqGZgnAoP42i6cceSZ3FIwX_He9GJKBx7TJnPcFWW_bgf56uQ0k-P3xHRtc4YMZc9Gs9Ujvh-oSxUQ8os9_dQ7PH6CKCMmqqkwQ9wgnbhgVkp1CNnhsS0Xxgwep4ZMN6IbWwbvTF1cqTITNKPZsxxOvMYfIzi8bm5DlMGK1zFtFHxWXahj2sBn6-S_2WlfniZ9W3nFbP2sUPDHSuLLg5Ef0fDFvvJE3pFXwrzUKPgPmbbDPd8_JvUPztySs7SmxFo-BU-7sg3Am2QS8v0O9qLD5fvJ_0Ft3migPKYRfUUo66cjYQnOAkHdfPqlDMk-ANnjKKkutwS9PmiOLkoLq-X5zoAUwcf4a01Y-h41aX4xU7-D7UsjTsW7H-Mf17eMo5-lnx4_NgEDcV4yrf6xjyqKJaWiJg7OCJI9_P8oJzFqiSxodqLx0nt2WTP9FGEF3fRpU7RUrusN6tkmLtf4NS3OVLv64f-6sw69hOiTMAQyaJ_NITQvlDlrOb7qxZIJrDTBGuEb7EMDIb-bV6UCN8V6Zm4vE6s792-5J7hvaeH4hzyL1rdLP7stttR_J4xgsDx2tp9w9K_ILmGRjJaT8F0gbXMkI5T9iMdp2uZq-rUtN-QMvUDN-05nzHGdQY2IPH8IZLM'       
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       this.setState({
  //         isLoading: false,
  //         projects: data['hydra:member'],
  //         totalProjects: data['hydra:totalItems']
  //       });
  //     });
  // }

  // async componentDidMount () {
  //   this.fetchProjects(1);
  // }  

  render() {
    const that = this;

    /*
      <h1>Homepage</h1>
      You are logged in as {that.props.profile.user.name}
    */

    return (
      <div className={styles.home}>        
        <ProjectList profile={that.props.profile}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,    
  };
}

export default connect(mapStateToProps)(withRouter(Home));
