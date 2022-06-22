import { fireEvent, render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component renders', () => {
  render(<App />, container);
 });

test('test that new-item-button is a button', () => {
  render(<App/>, container);
  const element = screen.getByTestId('new-item-button');
  expect(element.nodeName.includes("BUTTON")).toBe(true)
});

test('test that new-item-input is an input ', () => {
  render(<App/>, container);
  const element = screen.getByTestId('new-item-input');
  expect(element.innerHTML.toLowerCase().includes("input")).toBe(true)
});

test('test that duplicates cannot be added', () => {
  render(<App/>, container);
  const txtBox = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const dueDate = "12/10/2022";
  const addTodo = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(txtBox, { target: { value: "Homework"}});
  fireEvent.change(inputDate, {target: {value: dueDate}});
  fireEvent.click(addTodo);
  const checkTexts = screen.getAllByText(/Homework/i);
  const checkDates = screen.getAllByText(new RegExp(dueDate, "i"));
  expect(checkTexts.length).toEqual(1);
  expect(checkDates.length).toEqual(1);
  fireEvent.change(txtBox, { target: { value: "Homework"}});
  fireEvent.change(inputDate, {target: {value: dueDate}});
  fireEvent.click(addTodo);
  expect(checkTexts.length).toEqual(1);
  expect(checkDates.length).toEqual(1);
});

test('Submit Task with No Due Date', () => {
  render(<App/>, container);
  const txtBox = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addTodo = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(txtBox, { target: { value: "Homework"}});
  fireEvent.click(addTodo);
  expect(screen.queryByText("Homework")).not.toBeInTheDocument();
  expect(screen.queryByText("inputDate")).not.toBeInTheDocument();
});

test('submit task with no task name', () => {
  render(<App/>, container);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const dueDate = "12/30/2023";
  const addTodo = screen.getByRole('button', {name: /Add/i});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(addTodo);
  expect(screen.queryByText("Homework")).not.toBeInTheDocument();
  expect(screen.queryByText(dueDate)).not.toBeInTheDocument();
});

test('late tasks have different colors', () => {
  render(<App/>, container);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});

  const dueDate = "12/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  const currentBackground = screen.getByTestId(/History Test/i).style.background;
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
  expect(currentBackground).toEqual("rgb(255, 255, 255)");

  const dueLateDate = "12/12/2020";
  fireEvent.change(inputTask, { target: { value: "History Test Late"}});
  fireEvent.change(inputDate, { target: { value: dueLateDate}});
  fireEvent.click(element);
  const checkLate = screen.getByText(/History Test Late/i);
  const checkDateLate = screen.getByText(new RegExp(dueLateDate, "i"));
  const currentBackgroundLate = screen.getByTestId(/History Test Late/i).style.background;
  expect(checkLate).toBeInTheDocument();
  expect(checkDateLate).toBeInTheDocument();
  expect(currentBackgroundLate).toEqual("rgb(237, 75, 57)");
});

test('test that App component renders Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "12/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
 });
