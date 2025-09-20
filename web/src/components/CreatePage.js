import { useState, useCallback} from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileText, Image, Upload, X } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import styled from 'styled-components';
import toast, { Toaster } from 'react-hot-toast';

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`;

const CreatePage = ({ userAddress }) => {
    const isConnected = userAddress != null;
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        price: 0,
    });
    const [files, setFiles] = useState([]);
  
    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            type: file.type.split('/')[0],
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image': ['.jpeg', '.jpg', '.png', '.stl'],
        },
        maxSize: 200 * 1024 * 1024
    });

    const removeFile = (id) => {
        setFiles(prev => prev.filter(file => file.id !== id));
    };

    const hInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return Image;
            default: return FileText;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const hsubmit = async (e) => {
        console.log("开始处理");
        e.preventDefault();

        // 钱包连接
        if (!isConnected) {
            toast.error('请先连接钱包');
            return;
        }


        // 必须上传两个文件，封面和三维源码
        if(files.length !== 2) {
            toast.error('请上传两个文件');
            return;
        }

        if ((files[0].type === "model" && files[1].type === "image") ||
         (files[0].type === "image" && files[1].type === "model")) {

         } else {
            toast.error('请上传一张图片和一个三维源文件');
            return;
         }
        try {
           //NFT铸造，后续完善
           //
           //

           toast.success(`NFT创建成功`);            
        } catch (error) {
            console.error('创建失败:', error);
            toast.error('创建失败，请重试');
        } finally {

        }
    };

    return (
        <div className="create-seal-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="page-header"
                >
                    <Title>铸造你的手办NFT</Title>
                    <p className="page-subtitle">
                        您的源文件会被保护，购买NFT手办的用户将获得手办制作权
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onSubmit={hsubmit}
                    className="create-form"
                >
                    <div className="form-grid">
                        {/* Left Column */}
                        <div className="form-column">
                            <div className="form-group">
                                <label className="form-label">
                                    <Upload size={20} />
                                    手办文件 (1张成品效果，1个三维源文件)
                                </label>
                                <div
                                    {...getRootProps()}
                                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="dropzone-content">
                                        <Upload size={48} />
                                        <p>
                                            {isDragActive
                                                ? '放开文件上传'
                                                : '拖拽文件到这里，或点击选择文件'}
                                        </p>
                                        <span className="dropzone-hint">
                                            支持图片最大100MB<br></br>支持三维STL源文件最大100MB
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="uploaded-files">
                                    {files.map((fileItem) => {
                                        const Icon = getFileIcon(fileItem.type);
                                        return (
                                            <div key={fileItem.id} className="file-item">
                                                <div className="file-info">
                                                    <Icon size={24} />
                                                    <div className="file-details">
                                                        <span className="file-name">{fileItem.file.name}</span>
                                                        <span className="file-size">
                                                            {formatFileSize(fileItem.file.size)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {fileItem.preview && (
                                                    <img
                                                        src={fileItem.preview}
                                                        alt="preview"
                                                        className="file-preview"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(fileItem.id)}
                                                    className="remove-file-btn"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="form-column">
                            <div className="form-group">
                                <label className="form-label">
                                    <DynamicIcon name="captions" size={20} />
                                    手办标题 *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={hInputChange}
                                    placeholder="请输入手办的名字"
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FileText size={20} />
                                    手办描述 *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={hInputChange}
                                    placeholder="请描写手办创作的原因，寓意等..."
                                    className="input textarea"
                                    rows={8}
                                    required
                                />
                            </div>

                           <div className="form-group">
                                <label className="form-label">
                                    <DynamicIcon name="badge-cent" size={20} />
                                    手办报价(MON)*
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={hInputChange}
                                    placeholder="请输入手办的报价，单位MON"
                                    className="input"
                                    required
                                /> 
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="form-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <button
                            type="submit"
                            className="btn btn-primary submit-btn time-lock"
                        >铸造NFT</button>
                    </motion.div>
                </motion.form>
            </div>

            <style jsx="true">{`
        .create-main-page {
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          font-family: 'JetBrains Mono', monospace;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }

        .create-form {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          margin-bottom: 40px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 32px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .datetime-input {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 12px;
        }

        .dropzone {
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropzone:hover, .dropzone.active {
          border-color: rgba(102, 126, 234, 0.6);
          background: rgba(102, 126, 234, 0.1);
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: rgba(255, 255, 255, 0.7);
        }

        .dropzone-hint {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        .uploaded-files {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .file-details {
          display: flex;
          flex-direction: column;
        }

        .file-name {
          font-weight: 500;
          color: white;
        }

        .file-size {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .file-preview {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 8px;
        }

        .remove-file-btn {
          padding: 8px;
          background: rgba(255, 0, 0, 0.2);
          border: none;
          border-radius: 8px;
          color: #ff6b6b;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-file-btn:hover {
          background: rgba(255, 0, 0, 0.3);
        }

        .form-footer {
          display: flex;
          justify-content: center;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 48px;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .time-hint {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 8px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .create-form {
            padding: 24px;
          }

          .datetime-input {
            grid-template-columns: 1fr;
          }

          .submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        
        <Toaster />
        </div>

    );
};

export default CreatePage; 