<template>
	<div class="good-mood">
		<v-stage ref="stage"  :config="configKonva" class="stage-1">
			<v-layer ref="layer">
			</v-layer>
		</v-stage>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Konva from "konva";
import Tools from "@/tools/Tools";
import Words from "@/tools/Words";

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

	centerX:number = -1;

	mounted(){
		this.centerX = this.stageNode.getWidth() / 2;
		this.configKonva.width = this.stageRef.$el.clientWidth;
		this.configKonva.height = window.innerHeight - 100;
		setInterval(() => this.runElement(),3000)
	}


	amplitude = 500;
	period = 5000;

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
			fill: '#00D2FF',
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
		group.on("click", () => poly.setAttr("fill",alternateColor));
		group.add(poly,textBlock);
		return group;
	}

	runElement(){
		const fig = Tools.randBool()? this.createFigure(Tools.randomArrayMember(Words.positive),0,"green"):this.createFigure(Tools.randomArrayMember(Words.negative),0,"red");
		this.layer.add(fig);
		const xMove = Math.random() - 0.5;
		this.animate(fig,(x) => x + xMove,(y) => y - 1)
	}

	elementClick(event:any){
		const mousePos = this.stageNode.getPointerPosition();
		const x = mousePos.x - 190;
		const y = mousePos.y - 40;
		console.log(event,'x: ' + x + ', y: ' + y);
		this.animate(event.target,(x) => x + 1,(y) => y + 1);
	}

	animate(el:any,moveX:(x:number,time:number) => number,moveY:(y:number,time:number) => number){
		const anim = new Konva.Animation(function(frame:any) {
			if(el.attrs.y < -200){
				anim.stop();
				el.remove();
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
