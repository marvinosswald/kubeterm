<template>
    <div>
        <div class="row space-between">
            <span><span class="key">Phase</span> {{pod.status.phase}}</span>
            <span><span class="key">Host</span> {{pod.status.hostIP}}</span>
        </div>
        <div class="column labels">
                <span class="key">
                    Labels
                </span>
            <ul>
                <li v-for="(value, key) in pod.metadata.labels">
                    {{key}}: <span class="value">{{value}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Details',
    props: ['pod']
  }
</script>

<style scoped>

</style>
