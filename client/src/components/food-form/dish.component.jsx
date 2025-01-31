import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/user.context';
import cloutEnhancer from '../../controllers/clout-enhancements';

const Dish = (props) => {
  const [food, setFood] = useState(props.food);
  const { currentUser } = useContext(UserContext);
  const bool = currentUser ? currentUser._id : null;
  const [style, setStyle] = useState(bool === food.userId ? { fontWeight: 'bold' } : { fontWeight: 'normal' });
  const [loading, setLoad] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editVal, setVal] = useState(food.name);

  const clickDelHandler = () => {
    if (bool === food.userId) {
      setLoad(true);
      axios.delete(`/event/${props.eventId}`, { data: { food } })
        .then((result) => {
          setStyle({ textDecoration: 'line-through', fontWeight: 'bold' });
          cloutEnhancer(currentUser._id, -3);
        })
        .catch((err) => {
          console.error(err);
          setLoad(false);
        });
    }
  };

  const clickEditHandler = () => {
    const newName = editVal;
    const newFood = {
      name: newName,
      course: food.course,
      userId: food.userId,
    };

    setLoad(true);
    axios.put(`/event/update/${props.eventId}`, { food, newFood })
      .then((result) => {
        setFood(newFood);
        setLoad(false);
        setEdit(false);
      })
      .catch((err) => {
        console.error(err);
        setLoad(false);
        setEdit(false);
      });
  };

  const inputHandler = (e) => {
    setVal(e.target.value);
  };

  return (
    <li style={style}>
      {isEdit
        ? (
          <div>
            <div className="row float-center">
              <input
                className="col-sm-8"
                value={editVal}
                onChange={inputHandler}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    clickEditHandler();
                  }
                }}
              />
              <button
                className="col-sm-1"
                onClick={clickEditHandler}
                disabled={loading}
              >
                O
              </button>
              <button
                className="col-sm-1"
                disabled={loading}
                onClick={() => setEdit(false)}
              >
                X
              </button>
            </div>
            <div>
              {loading ? 'processing...' : ''}
            </div>
          </div>
        )
        : food.name}
      { (bool === food.userId) && !isEdit
        ? (
          <span className="float-right justify-content-between">
            <button onClick={() => setEdit(true)} disabled={loading}>Edit</button>
            <button onClick={clickDelHandler} disabled={loading}>Del</button>
          </span>
        )
        : ''}
    </li>
  );
};

export default Dish;
