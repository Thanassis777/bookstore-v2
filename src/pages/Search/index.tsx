import {useState} from 'react';
import './Search.scss';
import {Col, Row} from 'react-bootstrap';
import {default as SearchBar} from '../../components/FormGroups/IconText';
import {getService} from '../../api';
import BookCard, {BookCardProps} from '../../components/UI/BookCard';
import {BookModel} from '../AddBook/formModel';
import {useAppDispatch} from '../../store/storeHooks';
import {addItem} from '../../store/checkout';
import {useNavigate} from 'react-router';
import {ToastUtils} from '../../shared/utilities';
import {ToastTypes} from '../../shared/models/ApplicationTypes';

const radioLabels = ['Category', 'Year', 'Author'];

const Search = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState<BookCardProps[]>([]);

    const onSearchClick = (value: string, filter: string) => {
        return getService('/books').then((response) => {
            setData(response.data);
        });

        console.log(value, filter);

        getService('/books/623e060286eae16fe3cbd92c', {responseType: 'arraybuffer'})
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => console.log(err));
    };

    // const [selectedFilter, setSelectedFilter] = useState('');
    //
    // const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    //     const {value} = e.target;
    //
    //     setSelectedFilter(value);
    // };

    const onAddBook = (book: BookModel) => {
        const addedBook = {...book, amount: ++book.amount};
        dispatch(addItem(addedBook));
        ToastUtils.notifyToast(ToastTypes.INFO, 'Book added', {
            position: 'bottom-center',
        });
    };

    const onImageClick = (book: BookModel) => {
        navigate('/book-information', {state: book});
    };

    return (
        <>
            <Row className="bookCover">
                <Col>FREE AND DISCOUNTED BESTSELLERS</Col>
            </Row>
            <Row className="justify-content-center align-items-center searchBox">
                <Col>
                    <h3>
                        <i>Search your new book in Library</i>
                    </h3>
                    <SearchBar radioLabels={radioLabels} handleClick={onSearchClick} />
                </Col>
            </Row>
            <div className="mt-4 pb-5 products-container">
                {data?.map((book) => {
                    const bookProps = {
                        handeImageClick: onImageClick.bind(null, book),
                        handeAddClick: onAddBook.bind(null, book),
                        key: book._id,
                        ...book,
                    };

                    return <BookCard {...bookProps} />;
                })}
            </div>
        </>
    );
};

export default Search;
