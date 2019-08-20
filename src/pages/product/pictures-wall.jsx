import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import './upload.less'
import { reqDeleteImg } from '../../api/index'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants.js'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * 用于图片上传的组件  
 */ 
class PicturesWall extends React.Component {
    constructor(props) {
        super(props)

        let fileList = []
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img,index) => ({
                uid: -index,          // 每个file都有自己的唯一id
                name: img,  // 图片文件名
                status: 'done',     // 图片状态:done已经上传，uploading正在上传中，error，removed已删除
                url: BASE_IMG_URL + img,    // 图片地址
            }))
            
        }
        this.state = {
            previewVisible: false,  // 标识是否显示大图预览Modal
            previewImage: '',   // 大图的url
            fileList    // 所有已上传的图片
        };
    }
    static propTypes = {
        imgs: PropTypes.array        
    }    
    //   隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });
    // 获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)        
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        // file：当前操作的图片文件(上传/删除)
        // fileList：所有已上传图片文件对象的数组
        // console.log(fileList, file)
        // 上传成功，对图片信息进行修正(name,url)
        if (file.status ==='done') {
            const result = file.response
            if (result.status === 0) {
                message.success("上传成功")
                const { name, url } = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error("上传失败")
            }
        } else if (file.status==='removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功！')
            } else {
                message.error('删除图片失败！')
            }
        }
        // 操作中一直更新fileList状态
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" // 上传图片的地址
                    listType="picture-card"
                    fileList={fileList}     // 已经上传图片列表
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    accept='image/*' // 只接收图片
                    name='image'    //请求参数名
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall

/**
 * 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用，
 * 
 * 父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（组件对象），调用其方法
 * 
 */