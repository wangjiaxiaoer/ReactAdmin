import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './rich-text-editor.less'

/**
 * 富文本编辑器
 * yarn add react-draft-wysiwyg draftjs-to-html
 * wysiwyg  what you see is what you get
 */
export default class RichTextEditor extends Component {
    constructor(props) {
        super(props)
        const html = this.props.detail
        if (html) {
            // 如果有值
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            } 
        }else {
            this.state={
                //   创建一个没有内容的编辑对象
                editorState: EditorState.createEmpty(),
            }
        }
    }   
    
    uploadImageCallBack = (file)=> {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    // 得到图片地址
                    const url = response.data.url
                    resolve({ data: { link: url } })                    
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    static propTypes = {
        detail: PropTypes.string    
    }

    onEditorStateChange = (editorState) => {
        console.log("onEditorStateChange")
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        // 返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                  }}    
            />
        );
    }
}
