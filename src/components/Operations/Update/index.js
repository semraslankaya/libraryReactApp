import React, { Component } from 'react';
import "./style.scss";
import swal from '@sweetalert/with-react';
import axios from 'axios';

const config = require('../../../config.json');

export class UpdatePopup extends Component {

    constructor(props) {
        super(props);

        // this.handleSave = this.handleSave.bind(this);
        this.state = {
            BookId: "",
            BookName: "",
            BookAuthor: "",
            ISBN: "",
            YearOfPublication: "",
            Publisher: "",
            Type: "",
            Summary: "",
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            BookId: nextProps.BookId,
            BookName: nextProps.BookName,
            BookAuthor: nextProps.BookAuthor,
            ISBN: nextProps.ISBN,
            YearOfPublication: nextProps.YearOfPublication,
            Publisher: nextProps.Publisher,
            Type: nextProps.Type,
            Summary: nextProps.Summary,
        });
    }

    bookIdHandler(e) { this.setState({ BookId: e.target.value }); }
    bookNameHandler(e) { this.setState({ BookName: e.target.value }); }
    bookAuthorHandler(e) { this.setState({ BookAuthor: e.target.value }); }
    iSBNHandler(e) { this.setState({ ISBN: e.target.value }); }
    publisherHandler(e) { this.setState({ Publisher: e.target.value }); }
    yearOfPublicationHandler(e) { this.setState({ YearOfPublication: e.target.value }); }
    typeHandler(e) { this.setState({ Type: e.target.value }); }
    summaryHandler(e) { this.setState({ Summary: e.target.value }); }

    handlePatchBook = async () => {
        try {
            const params = {
                "BookId": this.state.BookId,
                "BookName": this.state.BookName,
                "ISBN": this.state.ISBN,
                "YearOfPublication": this.state.YearOfPublication,
                "Publisher": this.state.Publisher,
                "BookAuthor": this.state.BookAuthor,
                "Summary": this.state.Summary,
                "Type": this.state.Type,
                "ImageURL": `http://images.amazon.com/images/P/${this.state.ISBN}.01.LZZZZZZZ.jpg`
            };
            await axios.patch(`${config.api.invokeUrl}/books/${this.state.BookId}`, params);
            swal({
                title: "Good job!",
                text: "Book updated!",
                icon: "success"
            });
            setTimeout(() => { window.location.reload(true); }, 2000)
        } catch (err) {
            swal({
                title: `An error has occurred: ${err}!`,
                icon: "warning"
            });
            console.log(`Error updating product: ${err}`);
        }
    }

    render() {
        return (
            <div className="modal fade" id="patchModal" tabIndex="-1" role="dialog" aria-labelledby="patchModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="patchModalLabel">Edit Book</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">Book Id:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="Book Id"
                                        value={this.state.BookId}
                                        onChange={(e) => this.bookIdHandler(e)}
                                        disabled
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">Book Name:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="Book Name"
                                        value={this.state.BookName}
                                        onChange={(e) => this.bookNameHandler(e)}
                                        disabled
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">Book Author:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="Book Author"
                                        value={this.state.BookAuthor}
                                        onChange={(e) => this.bookAuthorHandler(e)}
                                        disabled
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">ISBN:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="ISBN"
                                        value={this.state.ISBN}
                                        onChange={(e) => this.iSBNHandler(e)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">Publisher:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="Publisher"
                                        value={this.state.Publisher}
                                        onChange={(e) => this.publisherHandler(e)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">Year Of Publication:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="Year Of Publication"
                                        value={this.state.YearOfPublication}
                                        onChange={(e) => this.yearOfPublicationHandler(e)}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <span className="modal-lable">Book Type:</span>
                                    <input
                                        className="form-kontrol"
                                        type="text"
                                        placeholder="Book Type"
                                        value={this.state.Type}
                                        onChange={(e) => this.typeHandler(e)}
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <span className="modal-lable">Summary:</span>
                                    <textarea
                                        className="textarea"
                                        placeholder="Summary"
                                        value={this.state.Summary}
                                        onChange={(e) => this.summaryHandler(e)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => { this.handlePatchBook() }}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}