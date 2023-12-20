const Events = require("../models/eventModel");
const jwt = require("jsonwebtoken");

const getListEvents = async (req, res) => {
  try {
    const events = await Events.find();

    return res.status(200).json({
      status: "Success",
      message: "Eventos listados",
      data: events,
      error: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Error listando eventos",
      error: error,
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, createdAt, location, ticketPrice } = req.body;
    const newEvent = new Events({
      title,
      description,
      location,
      ticketPrice,
    });

    await newEvent.save();

    res.status(200).json({
      status: "Success",
      message: "Evento creado",
      data: newEvent,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Failed",
      message: "Error creando evento",
      error: error,
    });
  }
};

const addUserGoEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const idUser = req.user.user._id;
    const eventLoad = await Events.findById(idEvent);

    if (!eventLoad.attendees.includes(idUser)) {
      eventLoad.attendees.push(idUser);
      await eventLoad.save();

      res.status(200).json({
        status: "Success",
        message: "Usuario añadido a evento",
        error: null,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Error añadiendo usuario a evento",
        error: "Este usuario ya esta apuntado",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(404).json({
      status: "Failed",
      message: "Error añadiendo usuario a evento",
      error: error,
    });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const idUser = req.user.user._id;
    const eventsUser = await Events.find({
      attendees: { $elemMatch: { $eq: idUser } },
    });

    return res.status(200).json({
      status: "Success",
      message: "Usuarios listados",
      data: eventsUser,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Failed",
      message: "Error listando usuarios",
      error: error,
    });
  }
};

const profitOneEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const event = await Events.findById(idEvent);
    const profit = event.ticketPrice * event.attendees.length;

    return res.status(200).json({
      status: "Success",
      message: `Ganancias: ${profit}`,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Failed",
      message: "Error listando usuarios",
      error: error,
    });
  }
};

const profitAllEvents = async (req, res) => {
  try {
    const events = await Events.find();

    let profit = 0;

    events.forEach((event) => {
        profit += event.ticketPrice * event.attendees.length;
    });
    
    console.log('profit', profit)
    return res.status(200).json({
      status: "Success",
      message: `Ganancias de todos los eventos: ${profit}`,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Failed",
      message: "Error listando usuarios",
      error: error,
    });
  }
};

module.exports = {
  createEvent,
  getListEvents,
  addUserGoEvent,
  getUserEvents,
  profitOneEvent,
  profitAllEvents,
};
