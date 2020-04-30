<template>
  <div class="container" style="margin-top:40px;">
    <!-- Image and text -->
    <nav class="navbar navbar-light bg-faded">
      <a class="navbar-brand" href="#">
        <h1 class="display-4">Links Scheduler</h1>
        <h6>
          Netflix bypass time limit
          <span class="text-success">ACTIVE</span>
        </h6>
        <p
          class="text-muted text-small"
          style="font-size: 12px;"
        >For netflix or any other link to work, you must be logged in prior to the link being opened</p>
        <p class="text-muted text-small" style="font-size: 12px;">
          Download caffeine app
          <a href="https://www.zhornsoftware.co.uk/caffeine/caffeine.zip">here</a> to keep your computer from sleeping
        </p>
      </a>
    </nav>
    <hr />
    <div id="app">
      <div class="row" style="border-bottom: 5px 2px">
        <button v-on:click="createScheduleBtn" class="btn btn-outline-primary ml-3">Add Schedule</button>
      </div>
      <br />
      <table class="table table-hover table-striped table-bordered">
        <tr>
          <th>Title</th>
          <th>Link</th>
          <th>Schedule</th>
          <th></th>
        </tr>

        <template v-for="(p, i) in schedules">
          <tr :key="i">
            <td>{{p.title}}</td>
            <td>{{p.link}}</td>
            <td>{{p.day}} {{p.time}} <span class="text-danger" v-if="p.opened">(opened)</span></td>
            <td>
              <button
                :disabled="p.isDeleting"
                v-on:click="deleteScheduleBtn(p.id)"
                class="btn btn-danger"
              >Delete</button>
            </td>
          </tr>
        </template>
      </table>

      <div class="modal fade" id="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Add Schedule</h4>
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
                  <div class="text-muted">Link must contain https:// or http://</div>
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
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    v-on:click="onSubmitSchedule"
                    :disabled="isSubmitable()"
                  >Save</button>
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
import options from "../js/util";

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
        opened: false
      }
    };
  },
  mounted: function() {
    window.jQuery = $;
    var self = this;
    $("#datetimepicker7").datetimepicker({
      format: "LT"
    });
    $("#datetimepicker7").on("change.datetimepicker", function(e) {
      try {
        self.schedule.time = e.date.format("h:mm a");
      } catch (e) {
        self.schedule.time = "";
      }
    });
    tabSchedulerOptions.getSchedules().then(res => {
      this.schedules = res;
    });
  },

  methods: {
    createScheduleBtn() {
      $("#modal").modal();
    },

    deleteScheduleBtn(id) {
      this.schedules = this.schedules.map(m => ({
        ...m,
        isDeleting: id === m.id
      }));

      tabSchedulerOptions
        .setSchedules(this.schedules.filter(f => f.id !== id))
        .then(() => {
          tabSchedulerOptions.getSchedules().then(res => {
            this.schedules = res;
          });
        });
    },
    onSubmitSchedule() {
      var self = this;
      this.schedule.id = moment().unix();
      tabSchedulerOptions
        .setSchedules(this.schedules.concat(this.schedule))
        .then(() => {
          tabSchedulerOptions.getSchedules().then(res => {
            self.schedules = res;
          });
        });
      $("#modal").modal("hide");
    },
    isSubmitable() {
      const { title, link, time, day } = this.schedule;
      if (!title || !link || !time || !day) return true;
      return false;
    }
  }
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
