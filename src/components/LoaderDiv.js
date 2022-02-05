import Loader from 'react-loader-spinner';

const LoaderDiv = () => {
    return (
        <div className="loader-div flex-center">
            <Loader type="ThreeDots" color="#2BAD60" height="100" with="100" />
        </div>
    );
}

export default LoaderDiv;