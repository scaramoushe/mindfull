<template>
	<div class="good-mood">
		<v-container class="grey lighten-5">
			<v-row no-gutters>
				<v-col
					cols="12"
					sm="6"
				>
					<v-card
						class="pa-2"
						outlined
						tile
					>
						<v-slider
							v-model="speed"
							hint="speed"
							max="4"
							min="1"
							step="0.1"
						></v-slider>
					</v-card>
				</v-col>
				<v-col
					cols="12"
					sm="6"
				>
					<v-card
						class="pa-2"
						outlined
						tile
					>
						<v-slider
							v-model="delay"
							hint="interval"
							max="3000"
							step="100"
							min="500"
						></v-slider>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<v-stage ref="stage"  :config="configKonva" class="stage-1">
			<v-layer ref="layer">
			</v-layer>
		</v-stage>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import Konva from "konva";
import Tools from "@/tools/Tools";
// import Words from "@/tools/Words";
// import * as d3 from  "d3";

@Component
export default class GoodMood extends Vue {
	@Prop() private msg!: string;
	configKonva = {
		width: 1000,
		height: 500
	};
	configCircle = {
		x: 100,
		y: 100,
		radius: 70,
		fill: "red",
		stroke: "black",
		strokeWidth: 4
	};

	speed = 2;
	delay = 1;

	centerX:number = -1;
	private remoteData: any;

	async loadData(){
		this.remoteData = await Tools.loadFromGD("https://spreadsheets.google.com/feeds/cells/1Hek33xszp0ceh41B1PN2ezuUt5jIC6jsr0QNVrXExZM/1/public/full?alt=json");
		console.log(this.remoteData);
	}

	get positive(){
		return this.remoteData.find((el) => el.name == "positive").data;
	}

	get negative(){
		return this.remoteData.find((el) => el.name == "megative").data;
	}

	async mounted(){
		this.centerX = this.stageNode.getWidth() / 2;
		this.configKonva.width = this.stageRef.$el.clientWidth;
		this.configKonva.height = window.innerHeight - 100;
		await this.loadData();
		this.restart();
	}

	interval?:number = undefined;

	@Watch("delay")
	restart(){
		if(this.interval) clearInterval(this.interval);
		this.interval = setInterval(() => this.runElement(),this.delay)
	}


	amplitude = 500;
	period = 5000;
	count = 0;

	get stageRef(){
		return (this.$refs.stage as any);
	}

	get stage(): Konva.Stage{
		return this.stageRef.getStage();
	}

	get layer(): Konva.Layer{
		return (this.$refs.layer as any).getNode();
	}
	get stageNode(){
		return this.stageRef.getNode();
	}

	startingX(offset:number){
		return Tools.randomNumber(offset,this.configKonva.width - offset);
	}

	createFigure(text:string,angle:number = 0,alternateColor = "magenta",_x = this.startingX(130),_y = this.configKonva.height + 100){
		const group = new Konva.Group({
			x: _x,
			y: _y,
			width: 130,
			height: 25,
			rotation: angle,
			draggable: true,
		});
		const poly =  new Konva.Ellipse({
			x: 90,
			y: 120,
			radiusX:100,
			radiusY:30,
			fill: Tools.randomColor(),
			stroke: 'black',
			strokeWidth: 4,
		});
		const fs = Math.min(200/text.length,25)
		const textBlock = new Konva.Text({
			x: 0,
			y: 102 + (25 - fs)/2,
			text:text,
			fontSize: fs,
			fontFamily: "sans-serif",
			fill: '#000',
			width: 180,
			padding: 5,
			align: 'center',
			verticalAlign:"middle",
		});
		// group.on("click", () => poly.setAttr("fill",alternateColor));
		group.on("dragstart", () => poly.setAttr("fill",alternateColor));
		group.on("mousedown", () => poly.setAttr("fill",alternateColor));
		group.add(poly,textBlock);
		return group;
	}

	runElement(){
		if(this.count < 100) {
			const fig = Tools.randBool() ? this.createFigure(Tools.randomArrayMember(this.positive), 0, "green") : this.createFigure(Tools.randomArrayMember(this.negative), 0, "red");
			this.layer.add(fig);
			const xMove = Math.random() - 0.5;
			this.animate(fig, (x) => x + xMove * this.speed, (y) => y - this.speed)
		}
	}

	animate(el:any,moveX:(x:number,time:number) => number,moveY:(y:number,time:number) => number){
		this.count++;
		const anim = new Konva.Animation((frame:any) =>{
			if(el.attrs.y < -200){
				anim.stop();
				el.remove();
				this.count--;
			}
			el.setX(moveX(el.attrs.x,frame.timeDiff));
			el.setY(moveY(el.attrs.y,frame.timeDiff));

		}, el.getLayer());

		anim.start();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
.stage-1{
	border: 1px solid magenta;
	background-color: #2c3e50;
}
</style>
