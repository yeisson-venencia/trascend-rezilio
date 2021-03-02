import React from "react";

import { withRouter } from "react-router-dom";
import HeaderPrivate from "../header/HeaderPrivate";
import FooterPrivate from "../footer/FooterPrivate";
import { connect } from "react-redux";
import styles from "../../css/CreateProject.module.scss";
import { Link } from "react-router-dom";
import { buildUrl } from "../../utils/UrlService";
import { lastIndexOf } from "lodash";

class EditGroup extends React.Component {
    constructor(props){
        super(props);
   
        this.state = {
            fields: {},
            errors: {},
            group:{}
        }

    }

    //Load Projects
    async loadGroup (id) {
        console.log("loadGroup");
        this.setState({isLoading: true});    
        await fetch(`https://risk-module-api.herokuapp.com/api/v1/groups/${id}`, {
          headers: new Headers({
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs'       
          }),
        })
          .then(response => response.json())
          .then(data => {
            this.setState({
              group: data
            });
          });
          console.log(this.state.groups);
      }


    async componentWillMount () {
        this.loadGroup(this.props.match.params.id);
    } 
    

    
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if(!fields["nameGroup"]){
            formIsValid = false;
            errors["nameGroup"] = "Project name cannot be empty";
        }

        this.setState({errors: errors});
           return formIsValid;
    }

    submitForm(e){
        console.log("submitgroup");
        if(this.handleValidation()){
            this.editGroup(this.props.match.params.id);
            let idxProject = this.state.group.project.substring(this.state.group.project.lastIndexOf("/")+1, this.state.group.project.length);
            this.props.history.push(`/projects/edit/${idxProject}`);        
        }else{
            e.preventDefault();
        }
    }

    handleChange(field, e){         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }

    editGroup(id){
        console.log("editGroup")                
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json',
                'Accept': 'application/ld+json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTIyOTI2MjMsImV4cCI6MTYxNTg5MjYyMywicm9sZXMiOltdLCJ1c2VybmFtZSI6ImFyY2Vsb3JAcmV6aWxpby5jb20ifQ.GYJOGNlJ-voqBztUVrmOT5AfqeBMq2Dy9Hx0c_XNDfzfEMlZddgqFJrmwVI5xGhzPVD5t9BwZqjdTNaX41_EDQvfkdJwL66nV1na09-qGr0e7Skx9q6TKhdx_-PXX78LW2H0QZLXnIJL7tzoqKhZoDJ3AuLCvIfqMP4ta-wr1PoIE_X6cjGGZqRlK0YO9A912LUKikzc-mHdaEz0WGttdEojEhm5ttvux9naO8-Ld9I7llIk_bP6Bpp5hdfmhvUCDSZoCfvmTeyMsOTtnQHr8JaB1Wln_8L5-1Ia-6S_mE-xenFNT6BHalhFPYwX9GC1mv5slSuaJoKNRvJH-hlFj_vHXZ4xD7ZVoxajBQHMZcMEh24shlKGnT96dfGHnSe2Fo_JjOSkgLvU-UsPI4FrMbHWg753a72I7YP7s0tryFCPPtjI7UdtUcFCk8ow4Z71BBk9NT7LqshXjNoxikz2R5HOVgHMO2YpS_y8b_7vgiN553xPZ3nMFB58AZ3o9by8LR7UxA9dMsOrFURjttn3LVQI-__dClFW9YdtXicB0tNLR6ITV73JSQVtSs4qRPMU8Ds6jyOu7IiBwqIdosxUls8ZdMXq0q_9EjmIe-dSpIMW75wqglPkv2EhZowo_GMdI37_pGxubGXlPAVs4yUMUihFfb9sN6C1kWMPi0suHYs'       
                 },
            body: JSON.stringify({
                name: this.state.fields["nameGroup"],
            })            
        }

        console.log(requestOptions)

        fetch(`https://risk-module-api.herokuapp.com/api/v1/groups/${id}`, requestOptions)
            .then( response => {
                const data =  response.json()                
            }) 
            .catch(error => {
                console.error("Error!")
            });        
    }

    render () { 
        const that = this;
        return (
            <>
            <HeaderPrivate auth={that.props.auth} />
        <div className={styles.createproject}>
            <div class="container-lg pt-4">
            <form onSubmit= {this.submitForm.bind(this)}>
            
            <div class="d-flex justify-content-between">
                <h4 class="mb-4" className={styles.titleheader}>Group test #1 - Group Settings</h4>
                <Link to={buildUrl("HOME")}>
                    <button class="btn btn-light ml-4 px-4" type="submit">Cancel</button>
                </Link>
            </div>
            <div class="mb-4 mt-3">
                <label for="nameGroup" class="form-label">Project Name</label>
                <div class="">
                    <input  type="text" class="col-6" id="nameGroup" onChange={this.handleChange.bind(this, "nameGroup")} 
                    defaultValue={this.state.group["name"]} />
                </div>
                <div>
                <span style={{color: "red"}}>{this.state.errors["nameGroup"]}</span>
                </div>
            </div>
            <br /><br />
            <button class="btn btn-primary ml-4 px-4" type="submit" className={styles.submitbutton}>Save</button>
            <br /><br />
            </form>
            </div>
        </div>
        <FooterPrivate />
        </>
        )
    }
}

function mapStateToProps(state) {
    return {
      profile: state.auth.profile,    
    };
  }
  
  export default connect(mapStateToProps)(withRouter(EditGroup));
  