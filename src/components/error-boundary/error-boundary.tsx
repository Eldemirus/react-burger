import React, {ErrorInfo, ReactNode} from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}
class ErrorBoundary extends React.Component<Props, State> {

    public state: State = {
        hasError: false
    };

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.log("Возникла ошибка!", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <section>
                    <h1>Что-то пошло не так :(</h1>
                    <p>
                        В приложении произошла ошибка. Пожалуйста, перезагрузите страницу.
                    </p>
                </section>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;