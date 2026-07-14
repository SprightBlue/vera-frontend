import {useState, useRef, type ChangeEvent, type SyntheticEvent, type MouseEvent, type RefObject} from 'react';
import type {AnalysisDetailResponse, AnalyzeRequestDto} from '@/features/analysis/api/analysisApi';
import {analysisApi} from '@/features/analysis/api/analysisApi';

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

interface UseAnalysisReturn {
    isLoading: boolean;
    isStartingChat: boolean;
    result: AnalysisDetailResponse | null;
    error: string | null;
    hasInteracted: boolean;
    text: string;
    file: File | null;
    fileInputRef: RefObject<HTMLInputElement | null>;
    setText: (text: string) => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    removeFile: (e?: MouseEvent) => void;
    handleSubmit: (e: SyntheticEvent, user: { fullName?: string } | null) => Promise<void>;
    startAnalysisChat: (analysisId: string) => Promise<string | null>;
}

export function useAnalysis(): UseAnalysisReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isStartingChat, setIsStartingChat] = useState<boolean>(false);
    const [result, setResult] = useState<AnalysisDetailResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);

    const [text, setText] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = (e?: MouseEvent) => {
        if (e) e.stopPropagation();
        if (isLoading) return;

        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === 'object' && err !== null && 'response' in err;
    };

    const executeAnalysis = async (request: AnalyzeRequestDto) => {
        setHasInteracted(true);
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await analysisApi.analyzeContent(request);
            setResult(response);

            setText('');
            removeFile();
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response) {
                const status = requestError.response.status;
                if (status === 413) {
                    setError("ERROR DE PROTOCOLO: EL ARCHIVO ADJUNTO EXCEDE EL LÍMITE PERMITIDO O EL FORMATO NO ES COMPATIBLE CON EL ESCANEO.");
                } else if (status === 422) {
                    setError("FALLO EN EL MOTOR ANALÍTICO: LA INTELIGENCIA ARTIFICIAL NO PUDO PROCESAR EL CONTENIDO INGRESADO. INTENTÁ CON OTRO TEXTO.");
                } else {
                    setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MOTOR DE SEGURIDAD. POR FAVOR, REINTENTÁ EL PROCESO.");
                }
            } else {
                setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MOTOR DE SEGURIDAD. POR FAVOR, REINTENTÁ EL PROCESO.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: SyntheticEvent, user: { fullName?: string } | null) => {
        event.preventDefault();
        if ((!text.trim() && !file) || isLoading || !user) return;

        try {
            await executeAnalysis({
                text: text.trim() || undefined,
                file: file,
                source: 'WEB',
            });
        } catch (submitError: unknown) {
            console.error("Error durante el procesamiento del formulario:", submitError);
        }
    };

    const startAnalysisChat = async (analysisId: string): Promise<string | null> => {
        setIsStartingChat(true);
        setError(null);
        try {
            return await analysisApi.initializeChatFromAnalysis(analysisId);
        } catch (chatError: unknown) {
            console.error("Error al iniciar el chat del análisis:", chatError);
            setError("FALLO EN EL SERVICIO: NO SE PUDO INICIAR EL ASISTENTE DE CONSULTA COMPARTIDO PARA ESTE ANÁLISIS.");
            return null;
        } finally {
            setIsStartingChat(false);
        }
    };

    return {
        isLoading,
        isStartingChat,
        result,
        error,
        hasInteracted,
        text,
        file,
        fileInputRef,
        setText,
        handleFileChange,
        removeFile,
        handleSubmit,
        startAnalysisChat
    };
}