import React, { useState, useEffect, useRef } from "react";
import "./SortVisualizer.css";
import { getQuickSortAnimations } from "../algorithms/QuickSort";
import { getInsertionSortAnimations } from "../algorithms/InsertionSort";
import { getMergeSortAnimations } from "../algorithms/MergeSort";
import { getBubbleSortAnimations } from "../algorithms/BubbleSort";

const ARR_LEN = 100;
const MIN_NUM = 10;
const MAX_NUM = 80;
const ACCESSED_COLOUR = "#000000";
const SORTED_COLOUR = "#E8A87C";

export default function SortVisualizer(props) {
  const [arr, setArr] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const containerRef = useRef(null);
  const [option, setOption] = useState("1");
  const [delay, setDelay] = useState(15);

  // const [stop, setStop] = useState(false);
  let when = [];
  useEffect(initialiseArray, []);
  function initialiseArray() {
    if (isSorting) return;
    if (isSorted) resetArrayColour();
    setIsSorted(false);
    const arr = [];
    for (let i = 0; i < ARR_LEN; i++) {
      arr.push((MAX_NUM - MIN_NUM) * (i / ARR_LEN) + MIN_NUM);
    }
    shuffle(arr);
    setArr(arr);
  }
  function bubbleSort() {
    const animation = getBubbleSortAnimations(arr);
    animateArrayUpdate(animation);
  }
  function mergeSort() {
    const animations = getMergeSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function insertionSort() {
    const animations = getInsertionSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function quickSort() {
    const animations = getQuickSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function animateArrayUpdate(animations) {
    if (isSorting) return;
    setIsSorting(true);
    let count = 0;
    when = [];
    animations.forEach(([comparison, swapped]) => {
      when.push(count);
      count += swapped === false ? 3 * delay : 0;
    });

    animations.forEach(([comparison, swapped], index) => {
      setTimeout(() => {
        if (!swapped) {
          if (comparison.length === 2) {
            const [i, j] = comparison;
            animateArrayAccess(i);
            animateArrayAccess(j);
          } else {
            const [i] = comparison;
            animateArrayAccess(i);
          }
        } else {
          setArr((prevArr) => {
            const [k1, val1, k2, val2] = comparison;
            const newArr = [...prevArr];
            newArr[k1] = val1;
            if (k2) {
              newArr[k2] = val2;
            }
            return newArr;
          });
        }
      }, when[index]);
    });
    setTimeout(() => {
      animateSortedArray();
    }, when[animations.length - 1] + delay);
  }

  function animateArrayAccess(index) {
    const arrayBars = containerRef.current.children;
    const arrayBarStyle = arrayBars[index].style;
    setTimeout(() => {
      arrayBarStyle.backgroundColor = ACCESSED_COLOUR;
    }, delay);
    setTimeout(() => {
      arrayBarStyle.backgroundColor = "";
    }, 2 * delay);
  }

  function animateSortedArray() {
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arrayBars.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      setTimeout(
        () => (arrayBarStyle.backgroundColor = SORTED_COLOUR),
        i * delay
      );
    }
    setTimeout(() => {
      setIsSorted(true);
      setIsSorting(false);
    }, arrayBars.length * delay);
  }

  function resetArrayColour() {
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arr.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      arrayBarStyle.backgroundColor = "";
    }
  }

  function handleChange() {
    // setStop(false);
    switch (option) {
      case "1":
        mergeSort();
        break;
      case "2":
        insertionSort();
        break;
      case "3":
        quickSort();
        break;
      case "4":
        bubbleSort();
        break;
      default:
        console.log("No Match");
    }
  }

  return (
    <div className="visualizer-container">
      {/* {console.log(stop)} */}
      <div className="header">
        <div className="app-button">
          <label>Choose An Algorithm: </label>
          <select
            onChange={(e) => {
              setOption(e.target.value);
            }}
            value={option}
          >
            <option value={1}>Merge Sort</option>
            <option value={2}>Insertion Sort</option>
            <option value={3}>Quick Sort</option>
            <option value={4}>Bubble Sort</option>
          </select>
        </div>
        <div className="app-button" onClick={handleChange}>
          START
        </div>
        <div className="app-button" onClick={initialiseArray}>
          SHUFFLE
        </div>
        <div
          className="control"
          onClick={() => {
            delay <= 5 && alert("Can't be Made faster");
            setDelay((prevDelay) => {
              return prevDelay > 5 ? prevDelay - 5 : prevDelay;
            });
          }}
        >
          -
        </div>
        <div className="number">DELAY= {delay}</div>
        <div
          className="control"
          onClick={() => {
            setDelay((prevDelay) => {
              return prevDelay + 5;
            });
          }}
        >
          +
        </div>
      </div>

      <div className="array-container" ref={containerRef}>
        {arr.map((barHeight, index) => (
          <div
            className="array-bar"
            style={{
              height: `${barHeight}vmin`,
              width: `${100 / ARR_LEN}vw`,
            }}
            key={index}
          ></div>
        ))}
      </div>
      <div className="app-footer">Made with 🤍 by Avinash Kumar Singh</div>
    </div>
  );
}

const shuffle = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
};
