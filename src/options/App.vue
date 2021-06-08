<template>
  <div class="container" style="margin-top: 40px">
    <!-- Image and text -->
    <nav class="navbar navbar-light bg-faded">
      <a class="navbar-brand" href="#">
        <h1 class="display-4">Shabbatlify</h1>
        <h6>
          Netflix bypass time limit
          <span class="text-success">ACTIVE</span>
        </h6>
        <p class="text-muted text-small" style="font-size: 12px">
          Tested with netflix, other providers that have autoplay may work
        </p>
        <p class="text-muted text-small" style="font-size: 12px">
          Download caffeine app
          <a href="https://www.zhornsoftware.co.uk/caffeine/caffeine.zip"
            >here</a
          >
          to keep your computer from sleeping
        </p>
      </a>
    </nav>
    <hr />
    <div id="app">
      <div class="row">
        <button
          v-on:click="createScheduleBtn"
          class="btn btn-outline-primary ml-3"
        >
          Add +
        </button>
      </div>
        <template v-for="(p, i) in schedules">
          <div :key="i" class="card">
            <div class="row">
            <div class="col-sm-7">
              <strong style="font-size: 17px;">{{ p.title }}</strong>
              <div style="font-size: 11px;">
                {{ p.link }}
              </div>
            </div>
            <div class="col-sm-3">
                {{ p.day }} {{ p.time }}
                <span class="text-danger" v-if="p.opened">(opened)</span>
            </div>
            <div class="col-sm-2">
                <button
                :disabled="p.isDeleting"
                v-on:click="deleteScheduleBtn(p.id)"
                class="btn btn-danger action-btn"
                >
                Delete
              </button>
            </div>
            </div>
          </div>
        </template>

      <div class="modal fade" id="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Add</h4>
            </div>
            <div class="modal-body">
              <form class="form-horizontol" method="POST" id="scheduleForm">
                <input type="text" hidden name="date" v-model="schedule.date" />
                <div class="form-group">
                  <input
                    name="title"
                    class="form-control"
                    v-model="schedule.title"
                    type="text"
                    placeholder="Title"
                  />
                </div>
                <div class="form-group">
                  <input
                    name="link"
                    class="form-control"
                    v-model="schedule.link"
                    type="text"
                    placeholder="Link"
                  />
                  <div class="text-muted">
                    Link must contain https:// or http://
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col">
                      <select class="custom-select mb-3" v-model="schedule.day">
                        <option value="">Choose day...</option>
                        <option>Sunday</option>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                      </select>
                    </div>
                    <div class="col">
                      <div
                        class="input-group date"
                        id="datetimepicker7"
                        data-target-input="nearest"
                      >
                        <input
                          placeholder="Pick a time"
                          type="text"
                          class="form-control datetimepicker-input"
                          data-target="#datetimepicker7"
                        />
                        <div
                          class="input-group-append"
                          data-target="#datetimepicker7"
                          data-toggle="datetimepicker"
                        >
                          <div class="input-group-text">
                            <i class="fa fa-clock-o"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-default"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    v-on:click="onSubmitSchedule"
                    :disabled="isSubmitable()"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- /.modal -->
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import "popper.js";
import "font-awesome/css/font-awesome.min.css";
import "tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js";
import "tempusdominus-bootstrap-4/build/css/tempusdominus-bootstrap-4.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../js/util";

export default {
  name: "App",
  data() {
    return {
      schedules: [],
      schedule: {
        id: "",
        title: "",
        link: "",
        day: "",
        time: "",
        opened: false,
      }
    };
  },
  mounted: function () {
    window.jQuery = $;
    var self = this;
    $("#datetimepicker7").datetimepicker({
      format: "LT",
    });
    $("#datetimepicker7").on("change.datetimepicker", function (e) {
      try {
        self.schedule.time = e.date.format("h:mm a");
      } catch (e) {
        self.schedule.time = "";
      }
    });

    tabSchedulerOptions.getSchedules().then((res) => {
      this.schedules = res.sort((a, b) => {
        const d1 = moment(a.day + a.time, "ddddh:mm a");
        const d2 = moment(b.day + b.time, "ddddh:mm a");
        return d1 - d2;
      });
    });
  },

  methods: {
    createScheduleBtn() {
      window.moment = moment
      navigator.clipboard
        .readText()
        .then((text) => {
          const newLink = text.startsWith("http") ? text : "";
          this.schedule.link = newLink
          this.schedule.title = decodeURIComponent(newLink.split('#')[1] || '')
        })
        .catch((err) => {
          console.error("Failed to read clipboard contents: ", err);
        });
      this.schedule.day = moment().format('dddd');

      $("#modal").modal();
    },

    deleteScheduleBtn(id) {
      this.schedules = this.schedules.map((m) => ({
        ...m,
        isDeleting: id === m.id,
      }));

      tabSchedulerOptions
        .setSchedules(this.schedules.filter((f) => f.id !== id))
        .then(() => {
          tabSchedulerOptions.getSchedules().then((res) => {
            this.schedules = res;
          });
        });
    },
    onSubmitSchedule() {
      var self = this;
      this.schedule.id = moment().unix();
      const linkStartsWithHttp = this.schedule.link.startsWith("http") 
      if(!linkStartsWithHttp) {
          alert('You link must start with http or https')
          return
      }

      tabSchedulerOptions
        .setSchedules(this.schedules.concat(this.schedule))
        .then(() => {
          tabSchedulerOptions.getSchedules().then((res) => {
            self.schedules = res;
          });
        });
      $("#modal").modal("hide");
    },
    isSubmitable() {
      const { title, link, time, day } = this.schedule;
      if (!title || !link || !time || !day) return true;
      return false;
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  padding: 12px;
  margin-top: 10px;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

</style>
