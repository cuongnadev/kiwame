import { useCallback, useEffect, useState } from "react";
import { Button } from "../../ui/button/Button";
import StepperProgressBar from "../../ui/progressbar/StepperProgressBar";
import { CheckCircle, Loader2, X } from "lucide-react";
import DetailVideoUpload from "./DetailVideoUpload";
import ComponentsVideoUpload from "./ComponentVideoUpload";
import VisibilityVideoUpload from "./VisibilityVideoUpload";
import { VideoPart } from "@/types/video";
import { on } from "events";

interface UploadEditDetailsPros {
    onClose: () => void,
    thumbnailUrl: string | null,
    parts: VideoPart[],
    videoUrl: string,
    uploadingVideo: boolean,
    onSubmit: (type: string) => void,
    videoFileName: string,
    title: string,
    forChildren: boolean | null,
    tags: string[],
    setForChildren: (forChildren: boolean | null) => void,
    setTitle: (title: string) => void,
    setTags: (tags: string[]) => void,
    description: string,
    setDescription: (description: string) => void,
    privacy: string,
    setPrivacy: (privacy: string) => void,
    setThumbnailFile: (file: File | null) => void,
    setThumbnailUrl: (url: string) => void,
    formStatus?: string,
}

export default function UploadEditDetails({ formStatus, parts,onClose, thumbnailUrl, videoUrl, uploadingVideo, onSubmit, title, forChildren,tags, privacy, setPrivacy, setTitle, description, setDescription,setTags, setForChildren, setThumbnailUrl, setThumbnailFile, videoFileName }: UploadEditDetailsPros) {
    const [currentStep, setCurrentStep] = useState(1)
    const [error, setError] = useState("")
    const [hasAttemptedNext, setHasAttemptedNext] = useState<[number, boolean][]>([[1, false], [2, false]]);
    const [typeVisibility, setTypeVisibility] = useState("privacy");
    const steps = [
        { id: 1, label: 'Chi tiết', sublabel: 'Các thành phần của video' },
        // { id: 2, label: 'Kiểm tra', sublabel: 'Chế độ hiển thị' },
        { id: 2, label: 'Hoàn tất', sublabel: 'Xuất bản' }
    ];

    const validateDetail = useCallback((): boolean => {
        if (!title.trim() || forChildren === null) {
            setError("detail");
            return false;
        }
        setError("");
        return true;
    }, [title, forChildren, setError]);

    const validateVisibility = useCallback((): boolean => {
        if (!privacy.trim()) {
            setError("visibility");
            return false;
        }
        setError("")
        return true;
    }, [privacy])

    useEffect(() => {
        if (hasAttemptedNext[0]?.[1] && currentStep === 1) {
            validateDetail();
        }
        if (hasAttemptedNext[1]?.[1] && currentStep === 2) {
            validateVisibility();
        }
    }, [title, forChildren, currentStep, hasAttemptedNext, validateDetail, validateVisibility]);

    const handleStepClick = (stepId: number) => {
        if (currentStep === 1 && stepId > 1) {

            setHasAttemptedNext(prev =>
                prev.map(([step, attempted]) =>
                    step === 1 ? [step, true] : [step, attempted]
                )
            );

            if (!validateDetail()) {
                return;
            }
        }
        setCurrentStep(stepId);
    };

    const save = () => {
        setHasAttemptedNext(prev =>
            prev.map(([step, attempted]) =>
                step === 1 ? [step, true] : [step, attempted]
            )
        );
        if (!validateVisibility()) {
            return;
        }

        onSubmit("save")
        setHasAttemptedNext(prev =>
            prev.map(([step]) =>
                [step, false]
            )
        );
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
                    <DetailVideoUpload uploadingVideo={uploadingVideo} formStatus={formStatus} parts={parts} videoUrl={videoUrl} title={title} tags={tags} setTags={setTags} forChildren={forChildren} thumbnailUrl={thumbnailUrl} setForChildren={setForChildren} videoFileName={videoFileName} setThumbnailUrl={setThumbnailUrl} setThumbnailFile={setThumbnailFile} setTitle={(e) => setTitle(e)} description={description} setDescription={(e) => setDescription(e)} error={error} />
                )}
                {/* {currentStep === 2 && (
                    <ComponentsVideoUpload />
                )} */}
                {currentStep === 2 && (
                    <VisibilityVideoUpload uploadingVideo={uploadingVideo} formStatus={formStatus} parts={parts} videoUrl={videoUrl} videoFileName={videoFileName} privacy={privacy} setPrivacy={setPrivacy} typeVisibility={typeVisibility} setTypeVisibility={setTypeVisibility} errorForm={error} />
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
                        text={currentStep === steps.length ? (typeVisibility === "schedule") ? "Lên lịch" : "Lưu" : 'Tiếp'}
                        onClick={currentStep === steps.length ? () => save() : () => handleStepClick(Math.min(steps.length, currentStep + 1))}
                        variant="primary"
                        radius="full"
                        disabled={typeVisibility === "privacy" && privacy === null}
                    />
                </div>
            </div>
        </div >
    )
}