import { h } from "preact";
import { route } from "preact-router";

import BaseComponent from "../BaseComponent";

// components
import TextField from "preact-material-components/TextField";
import FormField from "preact-material-components/FormField";
import Radio from "preact-material-components/Radio";
import Button from "preact-material-components/Button";

// local components
import WriterSelect from "../Writers/WriterSelect";

import { IDefProps, IDefState } from "../../iface";
import * as API from "../../api/main";

import { HIValue } from "../../lib/onchange";

interface EditPostProps extends IDefProps {
    postId?: string;
}

interface EditPostState extends IDefState {
    writerList: API.Writer[];

    selectedWriterId: string;
    selectedPostType: API.PostType;
    postDate: string;
    postContent: string;
}

export default class EditPost extends BaseComponent<EditPostProps, EditPostState> {
    constructor(props: EditPostProps, ctx: any) {
        super(props, ctx);
        this.state = {
            writerList: null,
            postDate: "",
            postContent: "",
            selectedWriterId: null,
            selectedPostType: API.PostType.dayView
        };

        this.uploadPost = this.uploadPost.bind(this);
    }

    uploadPost() {
        let method: string;
        let URL: string;

        if (this.props.postId) {
            URL = API.Urls.Diary.p("post", this.props.postId);
            method = "PATCH";
        } else {
            URL = API.Urls.Diary.p("all");
            method = "POST";
        }

        let body: API.Post = {
            date: this.state.postDate,
            text: this.state.postContent,
            type: this.state.selectedPostType,
            writer: this.state.selectedWriterId
        };

        this.download("uploading post", URL, method, body)
        .then( (res: API.RespID) => {
            if (this.props.postId) {
                this.displayMessage("Success", "The post was successfully updated");
            } else {
                route(`/diary/${res}`);
                this.displayMessage("Success", "The post was successfully created");
            }
        });
    }

    fetchWriters() {
        this.download("writer list", API.Urls.Writers.p("listall")).then((res: API.RespWriterList) => {
            this.setState({ writerList: res });
        });
    }

    fetchPost(id: string) {
        this.download("post data", API.Urls.Diary.p("post", id))
            .then((res: API.RespPost) => {
                this.setState({
                    postContent: res.text,
                    postDate: res.date,
                    selectedPostType: res.type,
                    selectedWriterId: res.writer
                });
            });
    }

    clearPost() {
        this.setState({
            postDate: "",
            postContent: "",
            selectedWriterId: null,
            selectedPostType: API.PostType.dayView
        });
    }

    componentDidMount() {
        this.fetchWriters();

        this.componentDidUpdate({ postId: "" });
    }

    componentDidUpdate(oldProps: EditPostProps) {
        if (this.props.postId != oldProps.postId) {
            if (!this.props.postId)
                this.clearPost();
            else
                this.fetchPost(this.props.postId);
        }
    }

    //////////////////////////////
    /*          RENDER          */
    //////////////////////////////

    renderPostType() {
        let ptypes = [API.PostType.budget, API.PostType.dayView, API.PostType.tiptrick];

        return <fieldset onChange={HIValue(this, "selectedPostType")}>
            {ptypes.map(itm => <FormField><Radio name="ptypesx" value={itm} checked={itm == this.state.selectedPostType} />{itm}</FormField>)}
        </fieldset>;
    }

    r() {
        const { writerList, postDate, postContent, selectedWriterId } = this.state;
        if (!writerList) return <h1>Load first</h1>;
        return <div>
            {this.renderPostType()}
            <WriterSelect onChange={HIValue(this, "selectedWriterId")} writers={writerList} selected={selectedWriterId} />
            <fieldset>
                <TextField type="date" helperText="Date of day" helperTextPersistent={true} box={true} onChange={HIValue(this, "postDate")} value={postDate} />

                <TextField rows={10} textarea={true} helperText="Post content" helperTextPersistent={true} box={true} fullwidth={true} onChange={HIValue(this, "postContent")} value={postContent} />
            </fieldset>

            <Button onClick={this.uploadPost}>{this.props.postId ? "Update post" : "Create post"}</Button>

        </div>
    }
}