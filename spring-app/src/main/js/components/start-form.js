import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import $ from "jquery";

const center = {
	display: "flex",
	flexDirection: "column",
	flexWrap: "wrap",
	justifyContent: "center",
	alignItems: "center",
};

/**
 * Components which is responsible for link and posts forms and submit button
 */
class StartForm extends React.Component {
    constructor(props) {
        super(props);

        /**
         * Contains forms information and errors. If errors not null then appropriate message
         * is shown to user.
         */
        this.state = {
            link: "",
            posts: 0,
            postsError: null,
            linkError: null,
        };
    }

    render() {
        return (
            <div style={center}>

                    <TextField
                        floatingLabelText="Link"
                        onChange={this.handleLinkChange.bind(this)}
                        errorText={this.state.linkError}
                        /> 

                    <TextField
                        floatingLabelText="Posts"
                        onChange={this.handlePostsChange.bind(this)}
                        errorText={this.state.postsError}
                        /> 

                    <RaisedButton label="Submit"
                                  onClick={this.validation.bind(this)}
								  style={{ marginTop: "20px" }}/>

            </div>
        );
    }

    showError = (errorDescription) => {
        if (errorDescription.type === "LINK") {
            this.setState({
                linkError: errorDescription.description
            });

            return;
        }

        if (errorDescription.type === "AMOUNT") {
            this.setState({
                postsError: errorDescription.description
            });
        }
    };

    showOffErrors = () => {
        console.log("no errors");

        this.setState({
            linkError: null,
        });

        this.setState({
            postsError: null,
        });
    };

    /**
     * Request to server and getting errors in case of wrong request.
     */
    validation = () => {
        let requestUrl = "http://localhost:8080/getStats";
        let requestData = {
            link: this.state.link,
            posts: this.state.posts,
        };

        // TODO : bind this
        let handleError = this.showError;
        let handleTable = this.props.handleSubmit;
        let stopLoad = this.props.stopLoad;
        let showOffErrors = this.showOffErrors;
        this.props.beginLoad();

        $.ajax({
            type: "POST",
            url: requestUrl,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(requestData),
            dataType: "json",
            success: function(response) {
                if (response.type != "OK") {
                    stopLoad();
                    handleError(response.description);
                    return;
                }

                showOffErrors();
                let table = response.data;
                handleTable(table);
            }
        });
    };

    handleLinkChange = (event) => {
        this.setState({
            link: event.target.value,
        });
    };

    handlePostsChange = (event) => {
        this.setState({
            posts: event.target.value,
        });
    };
}

export default StartForm;