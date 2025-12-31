import { useCallback, useEffect, useState } from "react";
import { Button } from "../../ui/button/Button";
import StepperProgressBar from "../../ui/progressbar/StepperProgressBar";
import { CheckCircle, Loader2, X } from "lucide-react";
import DetailVideoUpload from "./DetailVideoUpload";
import ComponentsVideoUpload from "./ComponentVideoUpload";
import VisibilityVideoUpload from "./VisibilityVideoUpload";

interface UploadEditDetailsPros {
    onClose: () => void,
    thumbnailUrl: string | null,
    videoUrl: string,
    uploadingVideo: boolean,
    onSubmit: (type: string) => void,
    videoFileName: string,
    title: string,
    forChildren?: boolean,
    setForChildren: (forChildren: boolean | null) => void,
    setTitle: (title: string) => void,
    description: string,
    setDescription: (description: string) => void,
    privacy: string,
    setPrivacy: (privacy: string) => void,
    setThumbnailFile: (file: File | null) => void,
    setThumbnailUrl: (url: string) => void,
}

export default function UploadEditDetails({ onClose,thumbnailUrl, videoUrl, uploadingVideo, onSubmit, title, forChildren, privacy, setPrivacy, setTitle, description, setDescription, setForChildren, setThumbnailUrl, setThumbnailFile, videoFileName }: UploadEditDetailsPros) {
    const [currentStep, setCurrentStep] = useState(1)
    const [error, setError] = useState("")
    const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
    const steps = [
        { id: 1, label: 'Chi tiết', sublabel: 'Các thành phần của video' },
        { id: 2, label: 'Kiểm tra', sublabel: 'Chế độ hiển thị' },
        { id: 3, label: 'Hoàn tất', sublabel: 'Xuất bản' }
    ];

    const validateDetail = useCallback((): boolean => {
        if (!title.trim() || forChildren === null) {
            setError("detail");
            return false;
        }
        setError("");
        return true;
    }, [title, forChildren, setError]);

    const validateVisibility = useCallback((): boolean =>{
      if (!privacy.trim()){
        setError("visibility");
        return false;
      }
      setError("")
      return true;
    },[privacy])

    useEffect(() => {
        if (hasAttemptedNext && currentStep === 1) {
            validateDetail();
        }
        if(currentStep === 3){
          validateVisibility();
        }
    }, [title, forChildren, currentStep, hasAttemptedNext, validateDetail]);

    const handleStepClick = (stepId: number) => {
        if (currentStep === 1 && stepId > 1) {
            setHasAttemptedNext(true); 

            if (!validateDetail()) {
                return; 
            }
        }
        setCurrentStep(stepId);
    };

    const save = () =>{
      if(!validateVisibility()){
        return;
      }
      onSubmit("save")
    }
    return (
        <div className=" relative flex flex-col bg-neutral-800 rounded-4xl shadow-2xl max-w-4xl w-full max-h-[90vh] h-full overflow-y-auto ">
            <div className="flex justify-between py-2 px-3 border-b border-b-neutral-500 items-center">
                <h2 className="text-white text-xl font-bold p-2">{title}</h2>
                <Button
                    icon={<X size={20} />}
                    onClick={onClose}
                    variant="ghost"
                    radius="full"
                />
            </div>
            <div className="w-full">
                <StepperProgressBar currentStep={currentStep} handleStepClick={handleStepClick} error={error} />
            </div>
            <div className="w-full flex-1 overflow-y-auto">
                {currentStep === 1 && (
                    <DetailVideoUpload videoUrl={videoUrl} title={title} forChildren={forChildren} thumbnailUrl={thumbnailUrl}  setForChildren={setForChildren} videoFileName={videoFileName} setThumbnailUrl={setThumbnailUrl} setThumbnailFile={setThumbnailFile} setTitle={(e) => setTitle(e)} description={description} setDescription={(e) => setDescription(e)} error={error} />
                )}
                {currentStep === 2 && (
                    <ComponentsVideoUpload />
                )}
                {currentStep === 3 && (
                    <VisibilityVideoUpload videoUrl={videoUrl} videoFileName={videoFileName} privacy={privacy} setPrivacy={setPrivacy} errorForm={error}/>
                )}
            </div>
            <div className="flex pr-4 items-center justify-between py-4 border-t border-neutral-500">
                {uploadingVideo ?
                    (<div className="flex pl-4 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang tải video ...</span>
                    </div>)
                    : (
                        <div className="flex pl-4 gap-2">
                            <span>Tải video hoàn tất</span>
                            <CheckCircle size={20} />
                        </div>
                    )}
                <div className="flex gap-4 justify-end">
                    <Button
                        text="Quay lại"
                        onClick={() => handleStepClick(Math.max(1, currentStep - 1))}
                        className={`${currentStep === 1 ? 'hidden!' : ''}`}
                        variant="ghost"
                        radius="full"
                    />
                    <Button
                        text={currentStep === steps.length ? 'Lưu' : 'Tiếp'}
                        onClick={currentStep === steps.length ? () => save() : () => handleStepClick(Math.min(steps.length, currentStep + 1))}
                        variant="primary"
                        radius="full"
                    />
                </div>
            </div>
        </div >
    )
}